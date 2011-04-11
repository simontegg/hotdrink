/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.text}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.text");

(function () {

  var common = hotdrink.controller.view.html.common;

  var compile = function (tree) {
    LOG("compiling " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var html = {};
    if (tree.options.label) {
      html.label = common.compileFieldLabel(id, tree.options.label);
    }
    if (tree.options.readonly) {
      var str = "<p><span class=\"value\">"
              + tree.options.value + "</span></p>";
      if (tree.options.label) {
        html.widget = str;
      } else {
        html.box = str;
      }
    } else {
      var initialValue =
        (tree.options.value) ? (tree.options.value) : ("");
      if (tree.options.lines) {
        html.widget = "<p><textarea id=\"" + id + "\" cols=\"30\" rows=\""
                    + tree.options.lines + "\">"
                    + initialValue + "</textarea></p>";
      } else {
        html.widget = "<p><input type=\"text\" id=\"" + id + "\" value=\""
                    + initialValue + "\" /></p>";
      }
    }
    tree.html = html;
  };

  namespace.extend("hotdrink.controller.view.html.text", {
    compile : compile,
    Controller : common.SingleController
  });

}());

