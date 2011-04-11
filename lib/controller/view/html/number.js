/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.number}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.number");

(function () {

  var common = hotdrink.controller.view.html.common;
  //var valueB = hotdrink.controller.behavior.value;

  var compile = function (tree) {
    LOG("compiling " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var result = {};
    if (tree.options.label) {
      result.label = common.compileFieldLabel(id, tree.options.label);
    }
    result.widget = "<p>";
    var initialValue =
      (tree.options.value) ? (tree.options.value) : ("0");
    if (tree.options.readonly) {
      result.widget += "<span class=\"number\" id=\"" + id + "\">"
                     + initialValue + "</span>";
    } else {
      result.widget += "<input type=\"text\" id=\"" + id + "\" value=\""
                     + initialValue + "\" />";
    }
    result.widget += "<span class=\"units\">" + tree.options.units
                   + "</span></p>";
    tree.html = result;
  };

  namespace.extend("hotdrink.controller.view.html.number", {
    compile : compile,
    Controller : common.SingleController
  });

}());

