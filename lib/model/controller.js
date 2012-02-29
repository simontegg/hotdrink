/**
 * @fileOverview <p>{@link hotdrink.model.Controller}</p>
 * @author John Freeman
 */

//provides("hotdrink.model.Controller");

(function () {

  var submitForm = function (url, data, cmdName) {
    var form = new Element("form", { action : url, method : "POST" });
    if (typeof data === "object") {
      for (var v in data) {
        if (data.hasOwnProperty(v)) {
          var value = data[v];
          if (typeof value !== "string")
            value = Object.toJSON(value);
          var input = new Element("input",
            { type : "hidden", name : v, value : value });
          form.appendChild(input);
        }
      }
    } else {
      cmdName = (cmdName === undefined) ? "" : cmdName.toString();
      if (cmdName === "")
        cmdName = "command";
      if (typeof data !== "string")
        data = Object.toJSON(data);
      var input = new Element("input",
        { type : "hidden", name : cmdName, value : data });
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  var defaultCommandHandler = function (data, cmdName) {
    submitForm("", data, cmdName);
  };

  /** @lends hotdrink.controller.Controller# */
  /**
   * @param {hotdrink.Model} model
   * @constructs
   * @class
   *   Wraps {@link hotdrink.Model}, providing support for the observer pattern.
   */
  var Controller = function Controller(model) {
    var ctrl = this;
    ctrl.callbacks = $H();
    ctrl.model = model;
    ctrl.cmdFns = {};
  };

  /**
   * Calls {@link hotdrink.Model#set}.
   * @param {String} variable
   * @param {concept.model.Value} value
   */
  Controller.prototype.set = function set(v, value) {
    ASSERT(this.model, "floating model controller");
    LOG("set: " + v + " = " + Object.toJSON(value));
    this.model.set(v, value);
  };

  /**
   * Calls {@link hotdrink.Model#get}.
   * @param {String} variable
   * @returns {concept.model.Value}
   */
  Controller.prototype.get = function get(v) {
    return this.model.get(v);
  };

  /**
   * Register an observer for a specific event in this model. The callback
   * should accept a {@link hotdrink.Model} from which it can read all necessary
   * information contained in the three graphs and any registered behaviors.
   * @param {String} eventName
   * @param {function (hotdrink.Model)} callback
   */
  Controller.prototype.observe = function observe(evtName, callback) {
    var entry = this.callbacks.get(evtName);
    if (!entry) {
      entry = [];
      this.callbacks.set(evtName, entry);
    }
    ASSERT(Object.isArray(entry), "expected array of callbacks");
    entry.push(callback);
    ASSERT(this.callbacks.get(evtName).length > 0,
      "failed to add callback; fixme");
  };

  /**
   * Calls {@link hotdrink.Model#update} and notifies observers.
   */
  Controller.prototype.update = function update() {
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
  };

  /**
   * Register a handler to be called upon execution of a command.  The handler can
   * be a function to be called or it can be a URL, in which case the effect of
   * the command is to submit a form to the given URL.  If the 'cmd' parameter
   * is not given then the handler is registered as the default for any commands which
   * have not been specifically given a handler.
   *
   * <p>
   * Note that only one handler may be given for each command, as well as only one
   * default handler.  Specifying a handler twice for the same command will result in
   * the first one being replaced by the second one.
   * </p>
   *
   * @see #doCommand - Executes a command.
   * @see hotdrink.openDialog - Allows specification of default handler.
   * @param handler
   *   Either a function to be called or a string URL to which the
   *   resulting data should be posted.
   * @param {String} name The optional command name which is to be handled.
   */
  Controller.prototype.registerCommand
    = function registerCommand(handler, name)
  {
    name = (name === undefined) ? "" : name.toString();
    if (typeof handler === "function") {
      this.cmdFns[name] = handler;
    } else {
      this.cmdFns[name] = function (data, command) {
        submitForm(handler, data, command);
      };
    }
  };

  /**
   * Performs the handler for the given command.  Attempts the following
   * in order, halting on the first one that is successful:
   *
   * <ol>
   *   <li>Executes the handler set for this command using {@link #registerCommand}</li>
   *   <li>Executes the default handler set using {@link #registerCommand}</li>
   *   <li>Executes the function <code>window[name]</code></li>
   *   <li>Submits the data as a form to the current url</li>
   * </ol>
   * @param data The data to use for the command.
   * @param {String} name The optional command name to execute.
   */
  Controller.prototype.doCommand = function doCommand(data, name) {
    var fn = this.cmdFns[name];
    if (fn === undefined) {
      fn = this.cmdFns[""];
      if (fn === undefined) {
        fn = window[name];
        if (typeof fn !== "function") {
          fn = defaultCommandHandler;
        }
      }
    }
    fn(data, name);
  };

  namespace.open("hotdrink.model").Controller = Controller;

}());

