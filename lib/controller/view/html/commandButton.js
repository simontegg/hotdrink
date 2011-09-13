/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.commandButton}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.commandButton");

(function () {

  var common = hotdrink.controller.view.html.common;
  var valueB = hotdrink.controller.behavior.value;
  var enableB = hotdrink.controller.behavior.enablement;

  var onChange = function (view, listener) {
    common.singleAddListener(view.elts, ["click"], listener);
  };

  var read = function (view) {
    alert("You synthesized the parameters\n" + view.elts.value);
  };

  var write = function (view, value) {
    view.elts.value = Object.toJSON(value);
  };

  var CommandButtonController = Class.create(common.ViewController,
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
    var elt = new Element("button", { type : "button", id : id })
                    .update(tree.options.label);
    tree.view = new CommandButtonController(elt);
    tree.dom = { box : new Element("p").update(elt) };
  };

  namespace.extend("hotdrink.controller.view.html.commandButton", {
    build : build,
    Controller : CommandButtonController
  });

}());

