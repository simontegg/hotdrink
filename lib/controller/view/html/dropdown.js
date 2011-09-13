/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.dropdown}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.dropdown");

(function () {

  var common = hotdrink.controller.view.html.common;

  var build = function (tree) {
    var elt = common.buildSelect(1, false, tree);
    tree.view = new common.SingleController(elt);
  };

  namespace.extend("hotdrink.controller.view.html.dropdown", {
    build : build,
    Controller : common.SingleController
  });

}());

