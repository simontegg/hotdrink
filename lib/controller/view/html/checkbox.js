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
    common.singleAddListener(view.elts, ["click", "keyup"], listener);
  };

  var read = function (view) {
    var vv = view.elts.checked;
    //var vv = $(view.elts).readAttribute("checked");
    // If the checked attribute is present, then it is considered true, even if
    // its literal value is "false". False is represented by the absence of the
    // attribute.
    var mv = (vv) ? (true) : (false);
    return { value : mv };
  };

  var write = function (view, value) {
    ASSERT(typeof value === "boolean",
      "expected boolean value for checkbox");
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

  var build = function (tree) {
    LOG("building " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var dom = {};
    if (tree.options.label) {
      dom.label = common.buildLabelBlock(id, tree.options.label);
    }
    var elt = new Element("input",
      { type : "checkbox", value : "true", id : id });
    dom.widget = new Element("p").insert(elt);
    tree.view = new CheckboxController(elt);
    tree.dom = dom;
  };

  namespace.extend("hotdrink.controller.view.html.checkbox", {
    build : build,
    Controller : CheckboxController
  });

}());

