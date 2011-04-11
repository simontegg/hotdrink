/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.selectMany}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.selectMany");

(function () {

  var common = hotdrink.controller.view.html.common;

  var compile = function (tree) {
    common.compileSelect(tree.options.size, true, tree);
  };

  var build = function (tree) {
    var view = common.buildSelect(tree.options.size, true, tree);
    tree.view = new common.SingleController(view);
  };

  namespace.extend("hotdrink.controller.view.html.selectMany", {
    compile : compile,
    build : build,
    Controller : common.SingleController
  });

}());

