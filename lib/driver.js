/** * @fileOverview <p>{@link hotdrink}</p>
 * @author John Freeman
 */

//provides("hotdrink");

//requires("hotdrink.model.Model");

(function () {

  var bindController = new hotdrink.bindings.Controller();

  /* Add default binders. */
  hotdrink.bindings.html.addBinders(bindController);

  /* Have to take our parameters in the wrong conceptual order because we have a
   * default for the context. */
  var bind = function bind(model, context) {
    if (!context) context = $('body');

    /* Bind each view in the context. */
    var views = $("*[data-bind]", context);
    LOG("Binding " + views.length + " elements");
    views.each(function () {
      bindController.bind(this, model);
    });
  };

  /**
   * @name hotdrink
   * @namespace Top-level library namespace.
   */
  namespace.extend("hotdrink", {
    bind : bind,
    /* Expose the binders dictionary for extension. */
    binders : bindController.binders
  });

}());

