/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.checkbox}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.checkbox");

(function () {

  var common = hotdrink.controller.view.html.common;
  var valueB = hotdrink.controller.behavior.value;

  var onChange = function (view, listener) {
    /* keyup instead of keypress, otherwise we'll read the
     * value before the user's edit. */
    common.addListener1(view.elts, ["click", "keyup"], listener);
  };

  var read = function (view) {
    //return $(view.elts).readAttribute("checked");
    return (view.elts.checked) ? (true) : (false);
  };

  var write = function (view, value) {
    //$(view.elts).writeAttribute("checked", value);
    if (value) {
      view.elts.checked = "checked";
    }
  };

  var CheckboxController = Class.create(common.ViewController,
    common.singleIdentify, {
    bind : function (model, options) {
      if (typeof options.value === "string") {
        valueB.bindRead(this, onChange, read, model, options.value);
        valueB.bindWrite(model, options.value, write, this);
      }
    }
  });

  var compile = function (tree) {
    LOG("compiling " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var result = {};
    if (tree.options.label) {
      result.label = common.compileFieldLabel(id, tree.options.label);
    }
    result.widget = "<p><input type=\"checkbox\" value=\"true\" id=\""
                  + id + "\" /></p>";
    tree.html = result;
  };

  var build = function (tree) {
    LOG("building " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var result = {};
    if (tree.options.label) {
      result.label = common.buildFieldLabel(id, tree.options.label);
    }
    var view = new Element("input",
      { type : "checkbox", value : "true", id : id });
    result.widget = new Element("p").insert(view);
    tree.view = new CheckboxController(view);
    tree.element = result;
  };

  namespace.extend("hotdrink.controller.view.html.checkbox", {
    compile : compile,
    build : build,
    Controller : CheckboxController
  });

}());

