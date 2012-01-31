/**
 * @fileOverview <p>{@link hotdrink.graph.EGraph}</p>
 * @author John Freeman
 */

//provides("hotdrink.graph.EGraph");

//requires("hotdrink.graph.Evaluator");

(function () {

  /* Provides hash table interface for values stored in EGraph. */
  var ValuesTable = function (model) {
    this.variables = model.variables;
  };

  ValuesTable.prototype = {
    get : function (v) {
      return this.variables[v].value;
    },
    set : function (v, value) {
      this.variables[v].value = value;
    },
    toString : function () {
      var result = "{";
      var first = true;
      Object.keys(this.variables).forEach(function (v) {
        if (first) {
          first = false;
        } else {
          result += ", ";
        }
        result += "\"" + v + "\" : " + Object.toJSON(this.get(v));
      }, this);
      result += "}";
      return result;
    }
  };

  /**
   * Evaluates a string expression to initialize a variable.
   * TODO: To initialize, put initializers into methods, "solve" graph with
   * them, and run evaluator.
   * @name initializeValue
   * @function
   * @inner
   * @param {Hash} values
   * @param {String} variable
   * @param {String} expression
   */
  var initializeValue = function (values, v, expr) {
    var value = null;
    if (typeof expr === "string") {
      var initializer = new Function("values", "return (" + expr + ");");
      if (typeof initializer !== "function") {
        //LOG("\"" + (typeof initializer) + "\" !== \"object\"");
        ERROR("syntax error in initializer for \"" + v + "\".");
      } else {
        value = initializer(values);
      }
    } else {
      LOG(v + " has no initializer");
    }
    LOG("initialized: " + v + " <= " + Object.toJSON(value));
    values.set(v, value);
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
        vv.value = null;
        vv.hasBeenEdited = false;
      }, this);

      Object.keys(this.methods).each(function (m) {
        var mm = this.methods[m];
        mm.inputIsUsed = {};
        mm.execute = methodRegistry[m];
      }, this);

      /* TODO: Fix this up. */
      Object.keys(inputs).forEach(function (v) {
        var vv = this.variables[v];
        ASSERT(vv.cellType === "input",
          "pass initializers only for input variables");
        vv.initializer = Object.toJSON(inputs[v]);
      }, this);

      this.values = new ValuesTable(this);

      Object.keys(this.variables).each(function (v) {
        /* Initializer may be undefined. This case is handled in
         * initializeValue(). Wouldn't hurt to ensure that every variable has an
         * "initializer", even if just null. */
        initializeValue(this.values, v, this.variables[v].initializer);
      }, this);

      LOG("initial valuation = " + this.values);
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
      if (this.changeSet.length == 0) {
        return;
      }

      LOG("Evaluating...");

      /* Preparation. */
      Object.keys(this.variables).forEach(function (v) {
        var vv = this.variables[v];
        vv.isComputed = false;
        vv.isChanged = false;
        vv.maybeChanged = false;
        vv.dependsOnSelf = false;
      }, this);

      this.changedSet.forEach(function (v) {
        var vv = this.variables[v];
        vv.isChanged = true;
        vv.maybeChanged = true;
      }, this);

      LOG("starting valuation = " + this.egraph.values);

      /* Evaluate. */
      /* TODO: Could the evaluator benefit from saving information across
       * updates? */
      var E = new hotdrink.graph.Evaluator(this);
      E.evalmany(Object.keys(this.variables));

      LOG("ending valuation = " + this.egraph.values);

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

  });

  var ns = namespace.open("hotdrink.graph");
  ns.EGraph = EGraph;

}());

