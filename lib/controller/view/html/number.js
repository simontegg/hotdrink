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

  var build = function (tree) {
    LOG("building " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var result = {};
    if (tree.options.label) {
      result.label = common.buildFieldLabel(id, tree.options.label);
    }
    result.widget = new Element("p");
    var initialValue =
      (tree.options.value) ? (tree.options.value) : ("0");
    var view = null;
    if (tree.options.readonly) {
      view = new Element("span",
          { "class" : "number", id : id })
          .insert(initialValue);
      result.widget.insert(view);
      //tree.view = new SpanController(view);
    } else {
      view = new Element("input",
          { type : "text", id : id, value : initialValue });
      result.widget.insert(view);
      tree.view = new common.SingleController(view);
    }
    result.widget.insert(
      new Element("span", { "class" : "units" })
        .insert(tree.options.units));
    tree.element = result;
  };

  namespace.extend("hotdrink.controller.view.html.number", {
    compile : compile,
    build : build,
    Controller : common.SingleController
  });

}());

