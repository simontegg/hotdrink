/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.selectOne}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.selectOne");

(function () {

  var common = hotdrink.controller.view.html.common;
  //var valueB = hotdrink.controller.behavior.value;

  var compile = function (tree) {
    common.compileSelect(tree.options.size, false, tree);
  };

  namespace.extend("hotdrink.controller.view.html.selectOne", {
    compile : compile
  });

}());

