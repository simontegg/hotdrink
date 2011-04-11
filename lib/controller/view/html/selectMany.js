/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.selectMany}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.selectMany");

(function () {

  var common = hotdrink.controller.view.html.common;
  //var valueB = hotdrink.controller.behavior.value;

  var compile = function (tree) {
    common.compileSelect(tree.options.size, true, tree);
  };

  namespace.extend("hotdrink.controller.view.html.selectMany", {
    compile : compile
  });

}());

