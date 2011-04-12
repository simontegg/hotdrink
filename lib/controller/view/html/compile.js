/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.registerWidgetsForCompile}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.compile");

(function () {

  var widgets = hotdrink.controller.view.html;

  var registry = [];
  [
    "row",
    "column",
    "checkbox",
    "checkboxGroup",
    "commandButton",
    "dropdown",
    "number",
    "radioGroup",
    "selectMany",
    "selectOne",
    "text"
  ].each(function (widgetName) {
    registry.push({
      type : widgetName,
      compile : widgets[widgetName].compile
    });
  });

  /**
   * @name registerWidgetsForCompile
   * @memberOf hotdrink.controller.view.html
   * @description
   *   Registers compilers that model {@link concept.view.Constructor} with a
   *   {@link hotdrink.controller.Factory}.
   * @public
   * @static
   * @function
   * @param {hotdrink.controller.Factory} factory
   */
  var registerWidgetsForCompile = function (factory) {
    factory.registerWidgets(registry);
  };

  namespace.open("hotdrink.controller.view.html").registerWidgetsForCompile
    = registerWidgetsForCompile;

}());

