/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.number}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.number");

(function () {

  var common = hotdrink.controller.view.html.common;
  var valueB = hotdrink.controller.behavior.value;
  var enableB = hotdrink.controller.behavior.enablement;

  var onChange1 = function (view, listener) {
    common.addListener1(view.elts, ["change", "click", "keyup"], listener);
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
        valueB.bindRead(this, onChange1, read, model, v);
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
      tree.view = new NumberController(view);
    }
    element.widget.insert(
      common.buildString(tree.options.units).addClassName("units"));
    tree.element = element;
  };

  namespace.extend("hotdrink.controller.view.html.number", {
    compile : compile,
    build : build,
    Controller : NumberController
  });

}());

