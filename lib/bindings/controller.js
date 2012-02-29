/**
 * @fileOverview <p>{@link hotdrink.bindings.Controller}</p>
 * @author John Freeman
 */

//provides("hotdrink.bindings.Controller");

(function () {

  var Controller = function Controller() {
    this.binders = {};
  };

  /* A binder takes a DOM element and a model and returns true if it wants
   * to be the last binder. */
  /* @param binders Map from tags to binders. */
  Controller.prototype.addBinders = function addBinders(newBinders) {
    Object.keys(newBinders).forEach(function (tag) {
      var stk = this.binders[tag];
      if (!stk) {
        stk = [];
        this.binders[tag] = stk;
      }
      stk.unshift(newBinders[tag]);
    }, this);
  };

  Controller.prototype.bind = function bind(view, model) {
    var self = this;

    /* For each view element, */
    $(view).each(function () {
      /* Get the binder stack if it exists. */
      var stk = self.binders[this.nodeName];
      if (!stk) return;

      /* Move down the stack, and stop if a binder returns true. */
      for (var i = 0; i < stk.length; ++i) {
        if (stk[i](this, model)) break;
      }
    });
  };

  namespace.open("hotdrink.bindings").Controller = Controller;

}());

