/**
 * @fileOverview <p>{@link hotdrink.graph.EGraph}</p>
 * @author John Freeman
 */

//provides("hotdrink.graph.EGraph");

//requires("hotdrink.graph.Evaluator");

(function () {

  var valuesToJSON = function (model) {
    var result = "{";
    var first = true;
    Object.keys(model.variables).forEach(function (v) {
      if (first) {
        first = false;
      } else {
        result += ", ";
      }
      result += "\"" + v + "\" : " + Object.toJSON(model.get(v));
    });
    result += "}";
    return result;
  };

  /**
   * Evaluates a string expression to initialize a variable.
   * @name initializeValue
   * @function
   * @inner
   * @param {String} variable
   */
  var initializeValue = function (model, v) {
    var expr = model.variables[v].initializer;
    var value = null;
    if (typeof expr === "string") {
      /* TODO: Rename parameter to "model". Requires change to parser. */
      var initializer = new Function("values", "return (" + expr + ");");
      if (typeof initializer !== "function") {
        //LOG("\"" + (typeof initializer) + "\" !== \"object\"");
        ERROR("invalid syntax in initializer for \"" + v + "\".");
      } else {
        value = initializer(model);
      }
    } else {
      LOG(v + " has no initializer");
    }
    LOG("initialized: " + v + " <= " + Object.toJSON(value));
    model.variables[v].value = value;
  };

  /**
   * @memberOf hotdrink.graph
   * @class
   *   Represents the evaluation graph within {@link hotdrink.Model}.
   *   Models {@link concept.model.Behavior}.
   */
  var EGraph = {

    initialize : function (cgraph, methodRegistry, inputs) {
      /* Allocate. */
      Object.keys(this.variables).forEach(function (v) {
        var vv = this.variables[v];
        //vv.value = null;
        vv.hasBeenEdited = false;
      }, this);

      Object.keys(this.methods).each(function (m) {
        var mm = this.methods[m];
        /* Whether I used this input the last time I ran. */
        mm.inputsUsed = mm.inputs.slice(0); /* clone */
        mm.execute = methodRegistry[m];
      }, this);

      /**
       * @property {String[]} changedSet
       *   List of variables that have been changed since the last call to
       *   update. The user can set multiple variables before updating, so we
       *   need to keep track of all changes. Consequently, for the first call
       *   to update, this should contain the names of all variables. */
      this.changedSet = Object.keys(this.variables);

      /* TODO: To initialize, put initializers into methods, "solve" graph with
       * them, and run evaluator. */
      Object.keys(inputs).forEach(function (v) {
        var vv = this.variables[v];
        ASSERT(vv.cellType === "input",
          "pass initializers only for input variables");
        vv.initializer = Object.toJSON(inputs[v]);
      }, this);

      Object.keys(this.variables).each(function (v) {
        /* Initializer may be undefined. This case is handled in
         * initializeValue(). Wouldn't hurt to ensure that every variable has an
         * "initializer", even if just null. */
        initializeValue(this, v);
      }, this);

      LOG("initial valuation = " + valuesToJSON(this));
    },

    /**
     * Get the value of a variable.
     * @param {String} variable
     * @returns {concept.model.Value}
     */
    get : function (v) {
      /* TODO: return VariableProxy. */
      return this.variables[v].value;
    },

    /**
     * Set the value of a variable.
     * @param {String} variable
     * @param {concept.model.Value} value
     */
    set : function (v, value) {
      var vv = this.variables[v];
      vv.hasBeenEdited = true;
      if (value !== vv.value) {
        vv.value = value;
        this.changedSet.push(v);
        this.touch(v);
      } else {
        LOG("Ignoring identity assignment.");
      }
    },

    /**
     * Runs the {@link hotdrink.graph.Evaluator}.
     * @returns {String[]}
     *   List of value change events in the form "variable.value".
     * @see concept.model.Behavior#update
     */
    update : function () {
      /* Skip if we can. */
      if (this.changedSet.length === 0) {
        return;
      }

      LOG("Evaluating...");

      /* Preparation. */
      Object.keys(this.variables).forEach(function (v) {
        var vv = this.variables[v];
        /* Stops recursion on self-loops during lazy evaluation. */
        vv.needsWrite = true;
        vv.isChanged = false;
        vv.maybeChanged = false;
        vv.dependsOnSelf = false;
      }, this);

      this.changedSet.forEach(function (v) {
        var vv = this.variables[v];
        vv.isChanged = true;
        vv.maybeChanged = true;
      }, this);

      LOG("starting valuation = " + valuesToJSON(this));

      /* Evaluate. */
      /* TODO: Could the evaluator benefit from saving information across
       * updates? */
      var E = new hotdrink.graph.Evaluator(this);
      E.evalmany(Object.keys(this.variables));

      LOG("ending valuation = " + valuesToJSON(this));

      this.changedSet.clear();

      LOG("Finished evaluation.");

      /* Return list of value change events. */
      var result = [];
      Object.keys(this.variables).forEach(function (v) {
        /* TODO: maybeChanged or isChanged? */
        if (this.variables[v].maybeChanged) {
          result.push(v + ".value");
        }
      }, this);
      LOG("evaluator events: " + Object.toJSON(result));
      return result;
    }

  };

  var ns = namespace.open("hotdrink.graph");
  ns.EGraph = EGraph;

}());

