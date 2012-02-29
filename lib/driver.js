/** * @fileOverview <p>{@link hotdrink}</p>
 * @author John Freeman
 */

//provides("hotdrink");

//requires("hotdrink.model.Model");

(function () {

  var bindCtrlr = new hotdrink.bindings.Controller();

  hotdrink.bindings.html.addBinders(bindCtrlr);

  /* Have to take our parameters in the wrong conceptual order because we have a
   * default for the context. */
  var bind = function bind(model, context) {
    if (!context) context = $('body');

    /* For each view in the context, ... */
    var views = $("*[data-bind]", context);
    LOG("Binding " + views.length + " elements");
    views.each(function () {
      /* Bind it. */
      bindCtrlr.bind(this, model);
    });
  };

  /**
   * @name hotdrink
   * @namespace Top-level library namespace.
   */
  namespace.extend("hotdrink", {
    bind : bind
  });

}());

