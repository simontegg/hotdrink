/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.checkboxGroup}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.checkboxGroup");

(function () {

  var common = hotdrink.controller.view.html.common;

  var compile = function (tree) {
    common.compileGroup("checkbox", tree);
  };

  var build = function (tree) {
    var elts = common.buildGroup("checkbox", tree);
    tree.view = new common.GroupController(elts);
  };

  namespace.extend("hotdrink.controller.view.html.checkboxGroup", {
    compile : compile,
    build : build,
    Controller : common.GroupController
  });

}());

