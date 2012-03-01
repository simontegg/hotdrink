/**
 * @fileOverview <p>{@link hotdrink.bindings.html.common}</p>
 * @author John Freeman
 */

//provides("hotdrink.bindings.html.common");

(function () {

  var common = hotdrink.bindings.common;
  var valueB = hotdrink.bindings.behavior.value;
  var enableB = hotdrink.bindings.behavior.enablement;

  var readOnlyBinder = function readOnlyBinder(write) {
    return function (views, model, getter) {
      var v = getter.target;
      ASSERT(typeof model.getMore(v) !== "undefined",
        "variable '" + v + "' does not exist");
      valueB.bindWrite(model, v, write, views);
    };
  };

  var binder = function binder(write, onChange, read, enable, disable) {
    return function (views, model, getter) {
      var v = getter.target;
      ASSERT(typeof model.getMore(v) !== "undefined",
        "variable '" + v + "' does not exist");
      valueB.bindWrite(model, v, write, views);
      valueB.bindRead(views, onChange, read, model, v);
      enableB.bindEnablement(model, v, enable, disable, views);
    };
  };

  /* NOTE: Intended for a single view. */
  var write = function write(view, value) {
    return $(view).val(value);
  };

  var onChange = function onChange(views, listener) {
    $(views).bind("change click keyup", listener);
  };

  /* NOTE: Intended for a single view. */
  var read = function read(view) {
    return { value : $(view).val() };
  };

  var enable = function enable(views) {
    return $(views).prop("disabled", false);
  };

  var disable = function disable(views) {
    return $(views).prop("disabled", true);
  };

  var bindReadOnly = readOnlyBinder(write);

  var bind = binder(write, onChange, read, enable, disable);

  /* Export: */

  namespace.extend("hotdrink.bindings.html.common", {
    /* Binders: */
    readOnlyBinder : readOnlyBinder,
    binder : binder,
    bindReadOnly : bindReadOnly,
    bind : bind,
    /* Mixins: */
    write : write,
    onChange : onChange,
    read : read,
    enable : enable,
    disable : disable,
    /* Converters and validators: */
    convertNumber : common.convertNumber
  });

}());
