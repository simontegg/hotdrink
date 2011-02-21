/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.registerWidgetsForEnablement}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.enablement");

(function () {

  /**
   * @name hotdrink.controller.view.html.registerWidgetsForEnablement
   * @description
   *   Builds visitors that handle enablement for HTML widgets and registers
   *   them with a {@link hotdrink.controller.Factory}.
   *   Models {@link concept.view.Bind.registerWidgets}.
   * @function
   * @param {hotdrink.controller.Factory} factory
   */
  var registerWidgetsForEnablement = function (factory) {

    hotdrink.controller.behavior.enablement.registerWidgets(factory, [
      { type : [
          "html-checkbox",
          "html-text-oneline",
          "html-select",
          "html-button"
        ],
        enable : function (view) {
          Form.Element.enable(view.elts);
        },
        disable : function (view) {
          Form.Element.disable(view.elts);
        }
      },

      { type : ["html-checkbox-multi", "html-radio"],
        enable : function (view) {
          view.elts.each(Form.Element.enable);
        },
        disable : function (view) {
          view.elts.each(Form.Element.disable);
        }
      }
    ]);

  };

  namespace.open("hotdrink.controller.view.html").registerWidgetsForEnablement
    = registerWidgetsForEnablement;

}());

