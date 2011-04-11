/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.selectOne}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.selectOne");

(function () {

  var common = hotdrink.controller.view.html.common;

  var compile = function (tree) {
    common.compileSelect(tree.options.size, false, tree);
  };

  var build = function (tree) {
    var view = common.buildSelect(tree.options.size, false, tree);
    tree.view = new common.SingleController(view);
  };

  namespace.extend("hotdrink.controller.view.html.selectOne", {
    compile : compile,
    build : build,
    Controller : common.SingleController
  });

}());

