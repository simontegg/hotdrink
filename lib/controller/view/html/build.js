/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.registerWidgetsForBuild}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.build");

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
      build : widgets[widgetName].build
    });
  });

  /**
   * @name registerWidgetsForBuild
   * @memberOf hotdrink.controller.view.html
   * @description
   *   Registers builders that model {@link concept.view.Constructor} with a
   *   {@link hotdrink.controller.Factory}.
   * @public
   * @static
   * @function
   * @param {hotdrink.controller.Factory} factory
   */
  var registerWidgetsForBuild = function (factory) {
    factory.registerWidgets(registry);
  };

  namespace.open("hotdrink.controller.view.html").registerWidgetsForBuild
    = registerWidgetsForBuild;

}());

