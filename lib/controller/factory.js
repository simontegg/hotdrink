/**
 * @fileOverview <p>{@link hotdrink.controller.Factory}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.Factory")

(function () {

  var Factory = Class.create(
  /** @lends hotdrink.controller.Factory# */
  {
    /**
     * @constructs
     * @class
     *   <p>
     *   Encapsulates the visitor algorithm for processing a view AST.
     *   </p>
     *
     *   <p>
     *   Processing consists of retrieving handles to widget elements and then
     *   binding them to the model. Handles are obtained by either finding
     *   existing elements or building new ones.
     *   </p>
     *
     *   <p>
     *   Clients can register their own visitors, allowing the factory to
     *   support new widget types, new behaviors, or both.
     *   </p>
     */
    initialize : function () {
      this.widgets = $H();
    },
    /**
     * <p>
     * Register new visitors with the factory.
     * </p>
     *
     * <p>
     * Three types of visitor are supported for the different phases of
     * processing: find, build, and bind. Each widget type may only have one
     * find and one build visitor. New registrants of such visitors will replace
     * their predecessors. However, each widget type can have multiple bind
     * visitors, all of which will be called during processing. Note: there is
     * no way to unregister a bind visitor.
     * </p>
     *
     * <p>
     * The same visitor can be registered to multiple widget types by passing an
     * array of names in the type field.
     * </p>
     *
     * @param {Object:VisitorRegistry} registry
     *   <pre>
     *   VisitorRegistry ::=
     *   [ {
     *     type : [/widget-type-name/] | /widget-type-name/,
     *     binders : [function (model, view, options)],
     *     find : function (options, children),
     *     build : function (options, children)
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
            entry = {
              binders : []
            };
            factory.widgets.set(type, entry);
            ASSERT(factory.widgets.get(type) === entry,
              "oops! didn't do what I expected; fixme");
          }
          if (item.binders) {
            entry.binders = entry.binders.concat(item.binders);
          }
          if (item.build) {
            entry.build = item.build;
          }
          if (item.find) {
            entry.find = item.find;
          }
        });
      });
    },
    /**
     * Process the AST by building widget elements and binding them to the
     * model. Note: not yet implemented.
     * @param {[Object:ViewAst]} trees
     *   <pre>
     *   ViewAst ::=
     *   {
     *     type : /widget-type-name/,
     *     options : {
     *       /name/ : /value/,
     *       ...
     *     },
     *     children : [ViewAst]
     *   }
     *   </pre>
     * @param {hotdrink.controller.ModelController} model
     * @returns {Element[]}
     *   An array of HTML elements corresponding to each tree passed in.
     */
    buildAndBind : function (trees, model) {},
    /**
     * Process the AST by finding widget elements and binding them to the model.
     * @param {[Object:ViewAst]} trees
     *   <p>See {@link hotdrink.controller.Factory#buildAndBind}</p>
     * @param {hotdrink.controller.ModelController} model
     */
    findAndBind : function (trees, model) {
      var factory = this;
      var result = [];
      trees.each(function (tree) {
        var helpers = factory.widgets.get(tree.type);
        if (helpers && helpers.find) {
          /* Get children to pass to find. */
          var children = [];
          if (tree.children) {
            children = factory.findAndBind(tree.children, model);
          }
          /* Find the view. */
          var view = helpers.find(tree.options, children);
          /* Bind the view. */
          helpers.binders.each(function (bind) {
            bind(model, view, tree.options);
          });
          result.push(view);
        } else {
          ERROR("unsupported widget type: " + tree.type);
        }
      });
      return result;
    }
  });

  namespace.open("hotdrink.controller").Factory = Factory;

}());

