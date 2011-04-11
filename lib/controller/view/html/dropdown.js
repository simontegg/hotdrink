/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.dropdown}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.dropdown");

(function () {

  var common = hotdrink.controller.view.html.common;
  //var valueB = hotdrink.controller.behavior.value;

  var compile = function (tree) {
    common.compileSelect(1, false, tree);
  };

  var build = function (tree) {
    var view = common.buildSelect(1, false, tree);
    tree.view = new common.SingleController(view);
  };

  namespace.extend("hotdrink.controller.view.html.dropdown", {
    compile : compile,
    build : build,
    Controller : common.SingleController
  });

}());

