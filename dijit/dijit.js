/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.registerWidgetsForBuild}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.build");

(function () {

  var common = hotdrink.controller.view.common;

  var registry = common.makeBuilderRegistry(
                   hotdrink.controller.view.dijit, 
                   [
                     "slider"
                   ]);

  namespace.open("hotdrink.controller.view.dijit").builders = registry;

}());

