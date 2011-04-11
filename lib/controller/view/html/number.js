/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.number}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.number");

(function () {

  var common = hotdrink.controller.view.html.common;

  var compile = function (tree) {
    LOG("compiling " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var html = {};
    if (tree.options.label) {
      html.label = common.compileFieldLabel(id, tree.options.label);
    }
    html.widget = "<p>";
    /* FIXME: placeholder until we differentiate between literals and variable
     * references. */
    var initialValue = "0";
    if (tree.options.readonly) {
      html.widget += "<span class=\"number\" id=\"" + id + "\">"
                   + initialValue + "</span>";
    } else {
      html.widget += "<input type=\"text\" id=\"" + id + "\" value=\""
                   + initialValue + "\" />";
    }
    html.widget += "<span class=\"units\">" + tree.options.units
                 + "</span></p>";
    tree.html = html;
  };

  var build = function (tree) {
    LOG("building " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var element = {};
    if (tree.options.label) {
      element.label = common.buildFieldLabel(id, tree.options.label);
    }
    element.widget = new Element("p");
    var view = null;
    if (tree.options.readonly) {
      view = common.buildString("").addClassName("number");
      element.widget.insert(view);
      tree.view = new common.StringController(view);
    } else {
      view = new Element("input", { type : "text", id : id });
      element.widget.insert(view);
      tree.view = new common.SingleController(view);
    }
    element.widget.insert(
      common.buildString(tree.options.units).addClassName("units"));
    tree.element = element;
  };

  namespace.extend("hotdrink.controller.view.html.number", {
    compile : compile,
    build : build,
    Controller : common.SingleController
  });

}());

