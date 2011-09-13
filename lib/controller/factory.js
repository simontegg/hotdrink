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
     *   Clients can register their own {@link concept.view.Builder}s,
     *   allowing the factory to support new widget types, new behaviors, or
     *   both.
     *   </p>
     */
    initialize : function () {
      this.widgets = $H();
    },

    /**
     * <p>
     * Register new {@link concept.view.Builder}s with the factory.
     * </p>
     *
     * <p>
     * Each widget type may only have one builder. Newly registered builders
     * will replace their predecessors.  The same builder can be registered to
     * multiple widget types by passing an array of names in the type field.
     * </p>
     *
     * <p>
     * Note: This system can be used to support transformers other than
     * builders.
     * </p>
     *
     * @param {Object:BuilderRegistry} registry
     *   <pre>
     *   BuilderRegistry ::=
     *   [ {
     *     type : [/widget-type-name/] | /widget-type-name/,
     *     build : {@link concept.view.Builder}
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
          if (item.build) {
            entry.build = item.build;
          }
        });
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
        .update(trees[0].dom.box);
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
          tree.dom = {};
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
  });

  namespace.open("hotdrink.controller").Factory = Factory;

}());

