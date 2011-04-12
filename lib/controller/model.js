/**
 * @fileOverview <p>{@link hotdrink.controller.ModelController}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.ModelController");

(function () {

  var ModelController = Class.create(
  /** @lends hotdrink.controller.ModelController# */
  {
    /**
     * @param {hotdrink.Model} model
     * @constructs
     * @class
     *   Wraps {@link hotdrink.Model}, providing support for the observer pattern.
     */
    initialize : function (model) {
      var ctrl = this;
      ctrl.callbacks = $H();
      ctrl.model = model;
    },
    /**
     * Register an observer for a specific event in this model. The callback
     * should accept a {@link hotdrink.Model} from which it can read all necessary
     * information contained in the three graphs and any registered behaviors.
     * @param {String} eventName
     * @param {function (hotdrink.Model)} callback
     */
    observe : function (evtName, callback) {
      var entry = this.callbacks.get(evtName);
      if (!entry) {
        entry = [];
        this.callbacks.set(evtName, entry);
      }
      ASSERT(Object.isArray(entry), "expected array of callbacks");
      entry.push(callback);
      ASSERT(this.callbacks.get(evtName).length > 0,
        "failed to add callback; fixme");
    },
    /**
     * Calls {@link hotdrink.Model#set}.
     * @param {String} variable
     * @param {concept.model.Value} value
     */
    set : function (v, value) {
      ASSERT(this.model, "floating model controller");
      LOG("set: " + v + " = " + Object.toJSON(value));
      this.model.set(v, value);
    },
    /**
     * Calls {@link hotdrink.Model#get}.
     * @param {String} variable
     * @returns {concept.model.Value}
     */
    get : function (v) {
      return this.model.get(v);
    },
    /**
     * Calls {@link hotdrink.Model#update} and notifies observers.
     */
    update : function () {
      var ctrl = this;
      var events = ctrl.model.update();
      LOG("Refreshing view...");
      events.each(function (evtName) {
        var callbacks = ctrl.callbacks.get(evtName);
        if (callbacks) {
          callbacks.each(function (callback) {
            callback(ctrl);
          });
        }
      });
      LOG("Refreshed.");
    }
  });

  var ns = namespace.open("hotdrink.controller");
  ns.ModelController = ModelController;

}());

