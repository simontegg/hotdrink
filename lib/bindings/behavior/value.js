/**
 * @fileOverview <p>{@link hotdrink.bindings.behavior.value}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.behavior.value);

(function () {

  /**
   * @name bindRead
   * @memberOf hotdrink.bindings.behavior.value
   * @description
   *   Registers a listener with the view. Whenever the view changes, the
   *   listener will read its value, set the bound variable in the model, and
   *   trigger an update of the model.
   * @public
   * @static
   * @function
   * @param {concept.view.View} view
   * @param {concept.view.View -> Listener -> ()} onChange
   * @param {concept.view.View -> concept.model.Value} read
   * @param {hotdrink.model.Controller} model
   * @param {String} variable
   */
  var bindRead = function (view, onChange, read, model, v) {
    view = $(view);

    var readListener = function () {
      LOG("reading #" + view.attr("id"));
      //assert(this === view.get(0) || this === view.get());
      var maybe = read(view);
      if (maybe.value) {
        model.set(v, maybe.value);
        model.update();
      } else if (maybe.error) {
        WARNING("validation error: " + maybe.error);
      } else {
        ERROR("expected error monad from read");
      }
    };

    onChange(view, readListener);
  };

  /**
   * @name bindWrite
   * @memberOf hotdrink.bindings.behavior.value
   * @description
   *   Registers a listener with the model. Whenever the bound variable
   *   changes, the listener will read its value and write the view.
   * @public
   * @static
   * @function
   * @param {hotdrink.model.Controller} model
   * @param {String} variable
   * @param {concept.view.View -> concept.model.Value -> ()} write
   * @param {concept.view.View} view
   */
  var bindWrite = function (model, v, write, view) {
    view = $(view);

    var writeListener = function (model2) {
      ASSERT(model2 === model,
        "listening for one model, but heard another");
      LOG("writing #" + view.attr("id"));
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
  namespace.extend("hotdrink.bindings.behavior.value", {
    bindRead : bindRead,
    bindWrite : bindWrite
  });

}());

