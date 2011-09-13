/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.number}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.number");

(function () {

  var common = hotdrink.controller.view.html.common;
  var valueB = hotdrink.controller.behavior.value;
  var enableB = hotdrink.controller.behavior.enablement;

  var onChange = function (view, listener) {
    common.singleAddListener(view.elts, ["change", "click", "keyup"], listener);
  };

  var read = function (view) {
    /* vv = view value */
    var vv = view.elts.value;
    ASSERT(typeof vv === "string",
      "expected string, got \"" + typeof vv + "\"");
    /* mv = model value */
    var mv = parseFloat(vv);
    var result = { value : mv };
    if (isNaN(mv) || typeof mv !== "number") {
      result = { error : "failed to produce a number" };
      /* TODO: reflect error to user. */
      //view.elts.addClassName("invalid");
    } else {
      //view.elts.removeClassName("invalid");
    }
    return result;
  };

  var write = function (view, mv) {
    ASSERT(typeof mv === "number",
      "expected number, got \"" + typeof mv + "\"");
    /* TODO: according to options, fancier formatting may be supported. */
    var vv = String.interpret(mv);
    ASSERT(typeof vv === "string",
      "failed to produce a string");
    view.elts.value = vv;
  };

  var NumberController = Class.create(common.ViewController,
    common.singleIdentify, {
    bind : function (model, options) {
      if (typeof options.value === "string") {
        var v = options.value;
        valueB.bindRead(this, onChange, read, model, v);
        valueB.bindWrite(model, v, write, this);
        enableB.bindEnablement(
          model,
          v,
          common.singleEnable,
          common.singleDisable,
          this);
      }
    }
  });

  var build = function (tree) {
    LOG("building " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var dom = {};
    if (tree.options.label) {
      dom.label = common.buildFieldLabel(id, tree.options.label);
    }
    var widget = new Element("p");
    var view = null;
    if (tree.options.readonly) {
      elt = common.buildString("").addClassName("number");
      widget.insert(elt);
      tree.view = new common.StringController(elt);
    } else {
      elt = new Element("input", { type : "text", id : id });
      widget.insert(elt);
      tree.view = new NumberController(elt);
    }
    widget.insert(
      common.buildString(tree.options.units).addClassName("units"));
    dom.widget = widget;
    tree.dom = dom;
  };

  namespace.extend("hotdrink.controller.view.html.number", {
    build : build,
    Controller : NumberController
  });

}());

