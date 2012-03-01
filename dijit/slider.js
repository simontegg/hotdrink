/**
 * @fileOverview <p>{@link hotdrink.bindings.dijit.slider}</p>
 * @author John Freeman
 */

//provides("hotdrink.bindings.dijit.slider");

(function () {

  dojo.require("dijit.form.Slider");

  var common = hotdrink.bindings.common;
  var valueB = hotdrink.bindings.behavior.value;
  var enableB = hotdrink.bindings.behavior.enablement;

  var onChange = function (view, listener) {
    view.watch("value", listener);
  };

  var read = function (view) {
    return common.convertNumber(view.get("value"));
  };

  var writeValue = function (view, value) {
    view.set("value", value);
  };

  var writeMinimum = function (view, value) {
    view.set("minimum", value);
    // Must refresh 'value' so that the slider will move its thumb.
    view.set("value", view.get("value"));
  };

  var writeMaximum = function (view, value) {
    view.set("maximum", value);
    // Must refresh 'value' so that the slider will move its thumb.
    view.set("value", view.get("value"));
  };

  var enable = function (view) {
    view.set("disabled", false);
  };

  var disable = function (view) {
    view.set("disabled", true);
  };

  var bind = function bind(view, model, options) {
    /* Look up the Dijit controller. */
    view = dijit.byId($(view).attr("id"));

    if (typeof options.value === "function") {
      var v = options.value.target;
      valueB.bindRead(view, onChange, read, model, v);
      valueB.bindWrite(model, v, writeValue, view);
      enableB.bindEnablement(model, v, enable, disable, view);
    } else {
      writeValue(view, options.value);
    }

    if (typeof options.min === "function") {
      var v = options.min.target;
      valueB.bindWrite(model, v, writeMinimum, view);
    } else {
      writeMinimum(view, options.min);
    }

    if (typeof options.max === "function") {
      var v = options.max.target;
      valueB.bindWrite(model, v, writeMaximum, view);
    } else {
      writeMaximum(view, options.max);
    }
  };

  namespace.open("hotdrink.bindings.dijit").bindSlider = bind;

}());

