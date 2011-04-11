/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.text}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.text");

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
    if (tree.options.readonly) {
      var html = "<p><span class=\"value\" id=\"id\">"
               + tree.options.value + "</span></p>";
      if (tree.options.label) {
        result.widget = html;
      } else {
        result.box = html;
      }
    } else {
      var initialValue =
        (tree.options.value) ? (tree.options.value) : ("");
      if (tree.options.lines) {
        result.widget = "<p><textarea id=\"" + id + "\" cols=\"30\" rows=\""
                      + tree.options.lines + "\">"
                      + initialValue + "</textarea></p>";
      } else {
        result.widget = "<p><input type=\"text\" id=\"" + id + "\" value=\""
                      + initialValue + "\" /></p>";
      }
    }
    tree.html = result;
  };

  namespace.extend("hotdrink.controller.view.html.text", {
    compile : compile,
    Controller : common.SingleController
  });

}());

