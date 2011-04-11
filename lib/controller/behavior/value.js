/**
 * @fileOverview <p>{@link hotdrink.controller.behavior.value}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.behavior.value);

(function () {

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
      var value = read(view);
      model.set(v, value);
      model.update();
    };

    onChange(view, readListener);

  };

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
   *   Bind widgets to values in the model.
   *   {@link concept.view.Behavior}.
   */
  namespace.extend("hotdrink.controller.behavior.value", {
    bindRead : bindRead,
    bindWrite : bindWrite
  });

}());

