/**
 * @fileOverview <p>{@link hotdrink.controller.Factory}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.Factory")

(function () {

  var preprocessTrees = function (trees) {
    return [ {
      type : "column",
      options : {},
      children : trees
    } ];
  };

  var Factory = Class.create(
  /** @lends hotdrink.controller.Factory# */
  {
    /**
     * @constructs
     * @class
     *   <p>
     *   Encapsulates the visitor algorithm for building and/or binding a user
     *   interface from a {@link concept.view.Ast}.
     *   </p>
     *
     *   <p>
     *   Clients can register their own {@link concept.view.Constructor}s,
     *   allowing the factory to support new widget types, new behaviors, or
     *   both.
     *   </p>
     */
    initialize : function () {
      this.widgets = $H();
    },
    /**
     * <p>
     * Register new {@link concept.view.Constructor}s with the factory.
     * </p>
     *
     * <p>
     * Currently, only compiler and builder constructors are supported.  Each
     * widget type may only have one compile and one build constructor. New
     * registrants of such constructors will replace their predecessors. The
     * same constructor can be registered to multiple widget types by passing
     * an array of names in the type field.
     * </p>
     *
     * @param {Object:ConstructorRegistry} registry
     *   <pre>
     *   ConstructorRegistry ::=
     *   [ {
     *     type : [/widget-type-name/] | /widget-type-name/,
     *     compile : {@link concept.view.Constructor},
     *     build : {@link concept.view.Constructor}
     *   } ]
     *   </pre>
     */
    registerWidgets : function (registry) {

      var factory = this;
      registry.each(function (item) {
        var types = item.type;
        if (!Object.isArray(types)) {
          types = [types];
        }
        types.each(function (type) {
          var entry = factory.widgets.get(type);
          if (!entry) {
            entry = {};
            factory.widgets.set(type, entry);
            ASSERT(factory.widgets.get(type) === entry,
              "oops! didn't do what I expected; fixme");
          }
          if (item.compile) {
            entry.compile = item.compile;
          }
          if (item.build) {
            entry.build = item.build;
          }
        });
      });
    },
    /**
     * Translate the AST into an equivalent HTML description.
     * @param {[concept.view.Ast]} trees
     * @returns {String:HTML}
     */
    compile : function (trees) {
      trees = preprocessTrees(trees);
      this.compile1(trees);
      return "<form class=\"eve\">\n" + trees[0].html.box + "\n</form>";
    },
    compile1 : function (trees) {
      //xLOG("compile(\n" + Object.toJSON(trees) + "\n)");
      var factory = this;
      trees.each(function (tree) {
        /* Handle children first. */
        if (tree.children) {
          factory.compile1(tree.children);
          /* Each child should now have an "html" member
           * containing HTML strings for that element (and its
           * children) expected by the compilers. */
        }
        /* Compile the view. */
        var helpers = factory.widgets.get(tree.type);
        if (!(helpers && helpers.compile)) {
          ERROR("unsupported widget type: " + tree.type);
          /* TODO: Break out of the whole function. This is a fatal error. */
          return;
        }
        helpers.compile(tree);
        if (!tree.html) {
          ERROR("could not compile " + tree.type);
          /* TODO: Break out of the whole function. This is a fatal error. */
          return;
        }
      });
    },
    /**
     * Process the AST by building widget elements and binding them to the
     * model.
     * @param {[concept.view.Ast]} trees
     * @param {hotdrink.controller.ModelController} model
     * @returns {Element}
     */
    buildAndBind : function (trees, model) {
      trees = preprocessTrees(trees);
      this.buildAndBind1(trees, model);
      return new Element("form", { "class" : "eve" })
        .update(trees[0].element.box);
    },
    buildAndBind1 : function (trees, model) {
      //("buildAndBind(\n" + Object.toJSON(trees) + "\n)");
      var factory = this;
      trees.each(function (tree) {
        /* Handle children first. */
        if (tree.children) {
          factory.buildAndBind1(tree.children, model);
          /* Each child should now have "view" and "element"
           * members representing the abstract view type expected
           * by the binders and the abstract element type
           * expected by the builders. */
        }
        /* Build the view. */
        var helpers = factory.widgets.get(tree.type);
        if (!(helpers && helpers.build)) {
          ERROR("unsupported widget type: " + tree.type);
          /* Default the output so that the preconditions of other builders are
           * not violated. */
          /* TODO: Break out of the whole function? */
          tree.element = {};
          return;
        }
        helpers.build(tree);
        var view = tree.view;
        /* Bind the view. */
        if (view) {
          view.bind(model, tree.options);
        } else {
          WARNING("no controller for " + tree.type);
        }
      });
    },
    /**
     * Process the AST, taking existing views and binding them to the model.
     * @param {[concept.view.Ast]} trees
     *   Note: only nodes with an id corresponding to an entry in the
     *   views map will be bound.
     * @param {Object:ViewMap} views
     *   <pre>
     *   ViewMap ::=
     *   {
     *     /id/ : {@link concept.view.Controller}
     *   }
     *   </pre>
     * @param {hotdrink.controller.ModelController} model
     */
    bind : function (trees, views, model) {
      var factory = this;
      trees.each(function (tree) {
        /* Handle children first. */
        if (tree.children) {
          factory.bind(tree.children, views, model);
        }
        /* Get the view. */
        var view = views[tree.options.id];
        if (!view) {
          WARNING("you did not pass a view for #" + tree.options.id);
          return;
        }
        /* Bind the view. */
        view.bind(model, tree.options);
      });
    }
  });

  namespace.open("hotdrink.controller").Factory = Factory;

}());

