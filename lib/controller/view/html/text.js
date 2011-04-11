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
      /* FIXME: placeholder until we differentiate between literals and variable
       * references. */
      var initialValue = "";
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

  var build = function (tree) {
    LOG("building " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var element = {};
    if (tree.options.label) {
      element.label = common.buildFieldLabel(id, tree.options.label);
    }
    var view = null;
    if (tree.options.readonly) {
      view = common.buildString(tree.options.value).addClassName("string");
      tree.view = new common.StringController(view);
      var str = new Element("p").update(view);
      if (tree.options.label) {
        element.widget = str;
      } else {
        element.box = str;
      }
    } else {
      if (tree.options.lines) {
        view = new Element("textarea",
          { id : id, cols : 30, rows : tree.options.lines });
        /* TODO: implement textarea controller */
      } else {
        view = new Element("input", { type : "text", id : id });
        tree.view = new common.SingleController(view);
      }
      element.widget = new Element("p").update(view);
    }
    tree.element = element;
  };

  namespace.extend("hotdrink.controller.view.html.text", {
    compile : compile,
    build : build,
    Controller : common.SingleController
  });

}());

