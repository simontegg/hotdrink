/**
 * @fileOverview <p>{@link hotdrink.controller.view.Toolkit.Widget}</p>
 * @author Author
 */

//provides("hotdrink.controller.view.Toolkit.Widget");

(function () {

  var common = hotdrink.controller.view.common;
  var valueB = hotdrink.controller.behavior.value;
  var enableB = hotdrink.controller.behavior.enablement;

  var onChange = function (view, listener) {}
  var read = function (view) { return null; };

  var write = function (view, value) {};

  var enable = function (view) {}
  var disable = function (view) {}

  var WidgetController = Class.create({
    initialize : function (elt) {},
    identify : function () { return ""; },
    bind : function (model, options) {
      if (typeof options.value === "string") {
        var v = options.value;
        valueB.bindRead(this, onChange, read, model, v);
        valueB.bindWrite(model, v, write, this);
        enableB.bindEnablement(model, v, enable, disable, this);
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
    var elt = null;
    dom.widget = elt;
    tree.view = new WidgetController(elt);
    tree.dom = dom;
  };

  namespace.extend("hotdrink.controller.view.Toolkit.Widget", {
    build : build,
    Controller : WidgetController
  });

}());

