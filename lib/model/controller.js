/**
 * @fileOverview <p>{@link hotdrink.model.Controller}</p>
 * @author John Freeman
 */

//provides("hotdrink.model.Controller");

(function () {

  /** @lends hotdrink.controller.Controller# */
  /**
   * @param {hotdrink.Model} model
   * @constructs
   * @class
   *   Wraps {@link hotdrink.Model}, providing support for the observer pattern.
   */
  var Controller = function Controller(model) {
    this.callbacks = {};
    this.model = model;
    this.cmdFns = {};

    /* Pass-through for model extensions. */
    model.extensions.forEach(function (f) {
      LOG("Your extension is my extension: " + f);
      this[f] = function () { return model[f].apply(model, arguments); };
    }, this);
  };

  /**
   * Return an object with these characteristics:
   *
   * <ul>
   *   <li>
   *     For each constant in the model, it has a property with the same name
   *     and value.
   *   </li>
   *   <li>
   *     For each variable in the model, it has a getter-setter method with the
   *     same name. (With getter-setters, calling with no arguments is a get and
   *     calling with a single argument is a set.)
   *   </li>
   *   <li>
   *     For each computed variable in the model, it has a getter method.
   *   </li>
   *   <li>
   *     For each command in the model, it has a method that will call the
   *     command with any arguments passed.
   *   <li>
   * </ul>
   */
  Controller.prototype.proxy = function proxy() {
    /* Cache the proxy. */
    if (!this._proxy) {
      var model = this;
      this._proxy = {};
      Object.keys(this.model.variables).forEach(function (v) {
        var cellType = this.getMore(v).cellType;
        if (cellType === "constant") {
          /* Copy constant over. */
          var accessor = this.get(v);
        } else if (cellType === "interface") {
          /* Use getter-setter. */
          var accessor = function () {
            if (arguments.length > 0) {
              return model.set(arguments[0]);
            } else {
              return model.get(v);
            }
          };
        } else if (cellType === "logic") {
          /* Use getter. */
          var accessor = function () { return model.get(v); };
        } else if (cellType === "output") {
          /* Defer to the stored command. */
          var accessor = function () {
            /* TODO: What should 'this' be? */
            return model.get(v).apply(null, arguments);
          };
        } else {
          /* Ignore invariants. */
          ASSERT(cellType === "invariant", "proxy: unhandled cell type");
          //var accessor = null;
        }
        this._proxy[v] = accessor;
      }, this);
    }

    return this._proxy;
  };

  /**
   * Similar to {@link hotdrink.model.Controller#proxy}, but for use in binding
   * contexts exclusively. It mimicks the same constraints on variable and
   * command references that exist during model construction.
   *
   * <ul>
   *   <li>
   *     For each constant in the model, it has a property with the same name
   *     and value.
   *   </li>
   *   <li>
   *     For each variable and computed variable in the model, it has a getter
   *     method carrying a 'target' property that holds the name of the
   *     variable.
   *   </li>
   *   <li>
   *     For each command in the model, it has a placeholder function carrying
   *     a 'command' property that holds the name of the command. Like a
   *     variable getter, it also carries a 'target' property in case the
   *     command is actually a non-function value suitable for binding. Binder
   *     beware, however.
   *   <li>
   * </ul>
   */
  Controller.prototype.bindingProxy = function bindingProxy() {
    /* Cache the proxy. */
    if (!this._bindingProxy) {
      var model = this;
      this._bindingProxy = {};
      Object.keys(this.model.variables).forEach(function (v) {
        var cellType = this.getMore(v).cellType;
        if (cellType === "constant") {
          /* Copy constant over. */
          var getter = this.get(v);
        } else if (cellType === "interface" || cellType === "logic") {
          /* Use getter that identifies the variable. */
          var getter = function () {
            if (arguments.length > 0) {
              throw Error("cannot set values from within bindings");
            } else {
              return model.get(v);
            }
          };
          getter.target = v;
        } else if (cellType === "output") {
          /* Use placeholder that identifies the command. */
          var getter = function () {
            /* We shouldn't call commands in the binding string for now. What
             * kind of behavior would we want? */
            ERROR("commands unavailable in bindings: " + v);
          };
          getter.command = v;
          getter.target = v;
        } else {
          /* Ignore invariants. */
          ASSERT(cellType === "invariant", "proxy: unhandled cell type");
          //var getter = null;
        }
        this._bindingProxy[v] = getter;
      }, this);
    }

    return this._bindingProxy;
  };

  /**
   * Subscribe to a specific event in this model. The callback should accept a
   * {@link hotdrink.Model} from which it can read all necessary information
   * in the three graphs and any behaviors.
   * @param {String} eventName
   * @param {function (hotdrink.Model)} callback
   */
  Controller.prototype.observe = function observe(evtName, callback) {
    var entry = this.callbacks[evtName];
    if (!entry) {
      entry = [];
      this.callbacks[evtName] = entry;
    }
    ASSERT(Array.isArray(entry), "expected array of callbacks");
    entry.push(callback);
    ASSERT(this.callbacks[evtName].length > 0,
      "failed to add callback; fixme");
    /* Initialize. */
    callback(this);
  };

  /**
   * Calls {@link hotdrink.Model#update} and notifies observers.
   */
  Controller.prototype.update = function update() {
    var events = this.model.update();
    LOG("Refreshing view...");
    events.forEach(function (evtName) {
      var cbs = this.callbacks[evtName];
      if (cbs) {
        cbs.forEach(function (cb) { cb(this); }, this);
      }
    }, this);
    LOG("Refreshed.");
  };

  namespace.open("hotdrink.model").Controller = Controller;

}());

