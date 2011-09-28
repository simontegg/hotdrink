/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.registerWidgetsForBuild}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.build");

(function () {

  var common = hotdrink.controller.view.common;

  /**
   * @name builders
   * @memberOf hotdrink.controller.view.html
   * @description
   *   Registry of {@link concept.view.Builder}s for HTML widgets.
   * @public
   */
  var registry = common.makeBuilderRegistry(
                   hotdrink.controller.view.html, 
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
                   ]);

  namespace.open("hotdrink.controller.view.html").builders = registry;

}());

