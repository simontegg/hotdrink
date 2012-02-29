/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.common}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.common");

(function () {

  var valueB = hotdrink.bindings.behavior.value;
  var enableB = hotdrink.bindings.behavior.enablement;

  var readOnlyBinder = function readOnlyBinder(write) {
    return function (view, model) {
      var v = $(view).attr("data-bind");
      ASSERT(typeof model.get(v) !== "undefined", "variable does not exist");
      valueB.bindWrite(model, v, write, view);
    };
  };

  var binder = function binder(write, onChange, read, enable, disable) {
    return function (view, model) {
      var v = $(view).attr("data-bind");
      ASSERT(typeof model.get(v) !== "undefined", "variable does not exist");
      valueB.bindRead(view, onChange, read, model, v);
      valueB.bindWrite(model, v, write, view);
      enableB.bindEnablement(model, v, enable, disable, view);
    };
  };

  var write = function write(view, value) {
    return $(view).val(value);
  };

  var onChange = function onChange(view, listener) {
    $(view).bind("change click keyup", listener);
  };

  var read = function read(view) {
    return $(view).val();
  };

  var enable = function enable(view) {
    return $(view).prop("disabled", false);
  };

  var disable = function disable(view) {
    return $(view).prop("disabled", true);
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
    /* Validators: */
    //convertNumber : common.convertNumber,
  });

}());

