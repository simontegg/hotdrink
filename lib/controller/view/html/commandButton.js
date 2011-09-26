/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.commandButton}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.commandButton");

(function () {

  var common = hotdrink.controller.view.html.common;
  var valueB = hotdrink.controller.behavior.value;
  var enableB = hotdrink.controller.behavior.enablement;

  var write = function (view, value) {
    view.elts.value = Object.toJSON(value);
  };

  var bindCommand = function (view, model, name, v) {
    if (typeof name !== "string")
      name = "";
    var listener = function () {
      if (typeof v === "string")
        model.doCommand(model.get(v), name);
      else
        model.doCommand(undefined, name);
    }
    common.singleAddListener(view.elts, ["click"], listener);
  }

  var CommandButtonController = Class.create(common.ViewController,
    common.singleIdentify, {
    bind : function (model, options) {
      var v = options.value;
      bindCommand(this, model, options.command, v);
      if (typeof v === "string") {
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

