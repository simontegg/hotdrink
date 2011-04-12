/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.radioGroup}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.radioGroup");

(function () {

  var common = hotdrink.controller.view.html.common;

  var compile = function (tree) {
    common.compileGroup("radio", tree);
  };

  var build = function (tree) {
    var elts = common.buildGroup("radio", tree);
    tree.view = new common.GroupController(elts);
  };

  namespace.extend("hotdrink.controller.view.html.radioGroup", {
    compile : compile,
    build : build,
    Controller : common.GroupController
  });

}());

