/**
 * @fileOverview <p>{@link hotdrink.controller.behavior.enablement}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.behavior.enablement);

(function () {

  /**
   * @name hotdrink.controller.behavior.enablement.registerWidgets
   * @description
   *   Builds visitors that handle the enablement and disablement of widgets
   *   and registers them with a {@link hotdrink.controller.Factory}. Models
   *   {@link concept.view.Behavior.registerWidgets}.
   * @function
   * @param {hotdrink.controller.Factory} factory
   * @param {Object:EnablementBehaviorRegistry} registry
   *   <pre>
   *   EnablementBehaviorRegistry ::=
   *   [ {
   *     type : [/widget-type-name/] | /widget-type-name/,
   *     enable : function (view) { ... },
   *     disable : function (view) { ... }
   *   } ]
   *   </pre>
   *   <p>
   *   Pass both a function for enabling the widget and a function for
   *   disabling the widget.
   *   </p>
   * @example
   *   hotdrink.controller.behavior.value.registerWidgets(factory, [
   *     { type : [
   *         "html-checkbox",
   *         "html-text-oneline",
   *         "html-select",
   *         "html-button"
   *       ],
   *       enable : Form.Element.enable,
   *       disable : Form.Element.disable
   *     }
   *   ]);
   */
  var registerWidgets = function (factory, registry) {

    var nextRegistry = [];

    registry.each(function (item) {

      /* TODO: Does removing all access to item within the binder actually
       * improve performance or memory use? */
      var enable = item.enable;
      var disable = item.disable;

      var binder = function (model, view, options) {

        var v = options.bindValue;

        var listener = function (model2) {
          ASSERT(model2 === model,
            "listening for one model, but heard another");
          /* TODO: Need better way of accessing variable information. */
          if (model.model.behaviors.get("enablement").variables.get(v).canBeDisabled) {
            LOG("disabling #" + view.identify());
            disable(view);
          } else {
            LOG("enabling #" + view.identify());
            enable(view);
          }
        };

        model.observe(v + ".canBeDisabled", listener);

      };

      nextRegistry.push({
        type : item.type,
        binders : [binder]
      });

    });

    factory.registerWidgets(nextRegistry);

  };

  /**
   * @name hotdrink.controller.behavior.enablement
   * @namespace
   *   Support enablement and disablement of widgets. Model of
   *   {@link concept.view.Behavior}.
   */
  namespace.open("hotdrink.controller.behavior.enablement").registerWidgets
    = registerWidgets;

}());

