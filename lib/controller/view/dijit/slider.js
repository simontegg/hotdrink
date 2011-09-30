/**
 * @fileOverview <p>{@link hotdrink.controller.view.dijit.slider}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.dijit.slider");

(function () {

  dojo.require("dijit.form.Slider");

  var common = hotdrink.controller.view.common;
  var valueB = hotdrink.controller.behavior.value;
  var enableB = hotdrink.controller.behavior.enablement;

  var onChange = function (view, listener) {
    view.elts.watch("value", listener);
  };

  var read = function (view) {
    return common.convertNumber(view.elts.get("value"));
  };

  var writeValue = function (view, value) {
    view.elts.set("value", value);
  };

  var writeMinimum = function (view, value) {
    view.elts.set("minimum", value);
    // Must refresh 'value' so that the slider will move its thumb.
    view.elts.set("value", view.elts.get("value"));
  };

  var writeMaximum = function (view, value) {
    view.elts.set("maximum", value);
    // Must refresh 'value' so that the slider will move its thumb.
    view.elts.set("value", view.elts.get("value"));
  };

  var enable = function (view) {
    view.elts.set("disabled", false);
  };

  var disable = function (view) {
    view.elts.set("disabled", true);
  };

  var SliderController = Class.create(common.ViewController, {
    identify : function () {
      if (!this.elts.get("id")) {
        this.elts.set("id", common.makeId());
      }
      return this.elts.get("id");
    },
    bind : function (model, options) {
      if (typeof options.value === "string") {
        var v = options.value;
        valueB.bindRead(this, onChange, read, model, v);
        valueB.bindWrite(model, v, writeValue, this);
        enableB.bindEnablement(model, v, enable, disable, this);
      }
      if (typeof options.minimum === "string") {
        var v = options.minimum;
        valueB.bindWrite(model, v, writeMinimum, this);
      }
      if (typeof options.maximum === "string") {
        var v = options.maximum;
        valueB.bindWrite(model, v, writeMaximum, this);
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
    var elt = new dijit.form.HorizontalSlider({
      id : id,
      value : 5,
      minimum : 0,
      maximum : 10,
      intermediateChanges : true,
      style : "width:300px;"
    });
    dom.widget = elt.get("domNode");
    tree.view = new SliderController(elt);
    tree.dom = dom;
  };

  namespace.extend("hotdrink.controller.view.dijit.slider", {
    build : build,
    Controller : SliderController
  });

}());

