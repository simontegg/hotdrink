/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.selectOne}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.selectOne");

(function () {

  var common = hotdrink.controller.view.html.common;

  var build = function (tree) {
    var elt = common.buildSelect(tree.options.size, false, tree);
    tree.view = new common.SingleController(elt);
  };

  namespace.extend("hotdrink.controller.view.html.selectOne", {
    build : build,
    Controller : common.SingleController
  });

}());

