/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.checkbox}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.checkbox");

(function () {

  var common = hotdrink.controller.view.html.common;
  var valueB = hotdrink.controller.behavior.value;
  var enableB = hotdrink.controller.behavior.enablement;

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
    } else {
      view.elts.checked = undefined;
    }
  };

  var CheckboxController = Class.create(common.ViewController,
    common.singleIdentify, {
    bind : function (model, options) {
      if (typeof options.value === "string") {
        var v = options.value;
        valueB.bindRead(this, onChange, read, model, v);
        valueB.bindWrite(model, v, write, this);
        enableB.bindEnablement(
          model, v, common.singleEnable, common.singleDisable, this);
      }
    }
  });

  var compile = function (tree) {
    LOG("compiling " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var html = {};
    if (tree.options.label) {
      html.label = common.compileFieldLabel(id, tree.options.label);
    }
    html.widget = "<p><input type=\"checkbox\" value=\"true\" id=\""
                + id + "\" /></p>";
    tree.html = html;
  };

  var build = function (tree) {
    LOG("building " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var element = {};
    if (tree.options.label) {
      element.label = common.buildFieldLabel(id, tree.options.label);
    }
    var view = new Element("input",
      { type : "checkbox", value : "true", id : id });
    element.widget = new Element("p").insert(view);
    tree.view = new CheckboxController(view);
    tree.element = element;
  };

  namespace.extend("hotdrink.controller.view.html.checkbox", {
    compile : compile,
    build : build,
    Controller : CheckboxController
  });

}());

