/**
 * @fileOverview <p>{@link hotdrink.controller.behavior.value}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.behavior.value);

(function () {

  /**
   * @name bindRead
   * @memberOf hotdrink.controller.behavior.value
   * @description
   *   Registers a listener with the view. Whenever the view changes, the
   *   listener will read its value, set the bound variable in the model, and
   *   trigger an update of the model.
   * @public
   * @static
   * @function
   * @param {concept.view.Controller} view
   * @param {concept.view.Controller -> Listener -> ()} onChange
   * @param {concept.view.Controller -> concept.model.Value} read
   * @param {hotdrink.controller.ModelController} model
   * @param {String} variable
   */
  var bindRead = function (view, onChange, read, model, v) {

    var readListener = function (evt) {
      DEBUG_BEGIN;
      /*
      if (Object.isArray(view.elts)) {
        ASSERT(view.elts.include(evt.findElement()),
          "listening for a few widgets, but heard another");
      } else {
        ASSERT(evt.findElement() === view.elts,
          "listening for one widget, but heard another");
      }
      */
      DEBUG_END;
      LOG("reading #" + view.identify());
      var maybe = read(view);
      if (typeof maybe.value !== "undefined") {
        model.set(v, maybe.value);
        model.update();
      } else if (typeof maybe.error !== "undefined") {
        WARNING("validation error: " + maybe.error);
      } else {
        ERROR("expected error monad from read");
      }
    };

    onChange(view, readListener);

  };

  /**
   * @name bindWrite
   * @memberOf hotdrink.controller.behavior.value
   * @description
   *   Registers a listener with the model. Whenever the bound variable
   *   changes, the listener will read its value and write the view.
   * @public
   * @static
   * @function
   * @param {hotdrink.controller.ModelController} model
   * @param {String} variable
   * @param {concept.view.Controller -> concept.model.Value -> ()} write
   * @param {concept.view.Controller} view
   */
  var bindWrite = function (model, v, write, view) {

    var writeListener = function (model2) {
      ASSERT(model2 === model,
        "listening for one model, but heard another");
      LOG("writing #" + view.identify());
      var value = model.get(v);
      write(view, value);
    };

    model.observe(v + ".value", writeListener);

  };

  /**
   * @name hotdrink.controller.behavior.value
   * @namespace
   *   Bind widgets to values in the model. Model of
   *   {@link concept.view.Behavior}.
   */
  namespace.extend("hotdrink.controller.behavior.value", {
    bindRead : bindRead,
    bindWrite : bindWrite
  });

}());

