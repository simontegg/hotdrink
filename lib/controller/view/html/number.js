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
    var result = {};
    if (tree.options.label) {
      result.label = common.compileFieldLabel(id, tree.options.label);
    }
    result.widget = "<p>";
    /* FIXME: placeholder until we differentiate between literals and variable
     * references. */
    var initialValue = "0";
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

  var build = function (tree) {
    LOG("building " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var result = {};
    if (tree.options.label) {
      result.label = common.buildFieldLabel(id, tree.options.label);
    }
    result.widget = new Element("p");
    var view = null;
    if (tree.options.readonly) {
      view = common.buildString("").addClassName("number");
      result.widget.insert(view);
      tree.view = new common.StringController(view);
    } else {
      view = new Element("input", { type : "text", id : id });
      result.widget.insert(view);
      tree.view = new common.SingleController(view);
    }
    result.widget.insert(
      common.buildString(tree.options.units).addClassName("units"));
    tree.element = result;
  };

  namespace.extend("hotdrink.controller.view.html.number", {
    compile : compile,
    build : build,
    Controller : common.SingleController
  });

}());

