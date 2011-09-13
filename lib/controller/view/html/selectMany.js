/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.selectMany}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.selectMany");

(function () {

  var common = hotdrink.controller.view.html.common;

  var build = function (tree) {
    var elt = common.buildSelect(tree.options.size, true, tree);
    tree.view = new common.SingleController(elt);
  };

  namespace.extend("hotdrink.controller.view.html.selectMany", {
    build : build,
    Controller : common.SingleController
  });

}());

