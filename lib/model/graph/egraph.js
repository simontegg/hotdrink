/**
 * @fileOverview <p>{@link hotdrink.model.graph.EGraph}</p>
 * @author John Freeman
 */

//provides("hotdrink.model.graph.EGraph");

//requires("hotdrink.model.graph.Evaluator");

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
      result += "\"" + v + "\" : " + JSON.stringify(model.get(v));
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
    var value = null;
    var initializer = model.variables[v].initializer;
    if (initializer) {
      value = initializer(model);
    } else {
      LOG(v + " has no initializer");
    }
    LOG("initialized: " + v + " <= " + JSON.stringify(value));
    model.variables[v].value = value;
  };

  /**
   * @memberOf hotdrink.graph
   * @class
   *   Represents the evaluation graph within {@link hotdrink.Model}.
   *   Models {@link concept.model.Behavior}.
   */
  var EGraph = {};

  EGraph.initialize = function initialize() {
    /* Allocate. */
    Object.keys(this.variables).forEach(function (v) {
      var vv = this.variables[v];
      vv.hasBeenEdited = false;
    }, this);

    Object.keys(this.methods).forEach(function (m) {
      /* Which inputs I used the last time I ran. */
      var mm = this.methods[m];
      mm.inputsUsed = [];
    }, this);

    /**
     * @property {String[]} changedSet
     *   List of variables that have been changed since the last call to
     *   update. The user can set multiple variables before updating, so we
     *   need to keep track of all changes. Consequently, for the first call
     *   to update, this should contain the names of all variables. */
    this.changedSet = Object.keys(this.variables);

    Object.keys(this.variables).forEach(function (v) {
      /* Initial expression may be undefined. This case is handled in
       * initializeValue(). */
      initializeValue(this, v);
    }, this);

    LOG("initial valuation = " + valuesToJSON(this));
  };

  /**
   * Get the value of a variable.
   * @param {String} variable
   * @returns {concept.model.Value}
   */
  EGraph.get = function get(v) {
    return this.variables[v].value;
  };

  /**
   * Returns all the information for the variable.
   * @param {String} variable
   * @returns {concept.model.Variable}
   */
  EGraph.getMore = function getMore(v) {
    return this.variables[v];
  };

  /**
   * Set the value of a variable.
   * @param {String} variable
   * @param {concept.model.Value} value
   */
  EGraph.set = function set(v, value) {
    LOG("set: " + v + " = " + JSON.stringify(value));
    var vv = this.variables[v];
    vv.hasBeenEdited = true;
    if (value !== vv.value) {
      vv.value = value;
      this.changedSet.push(v);
      this.touch(v);
    } else {
      LOG("Ignoring identity assignment.");
    }
  };

  /**
   * Runs the {@link hotdrink.model.graph.Evaluator}.
   * @returns {String[]}
   *   List of value change events in the form "variable.value".
   * @see concept.model.Behavior#update
   */
  EGraph.update = function update(events) {
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
      vv.usedBy = [];
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
    var E = new hotdrink.model.graph.Evaluator(this);
    E.evalMany(Object.keys(this.variables));

    LOG("ending valuation = " + valuesToJSON(this));

    this.changedSet = [];

    LOG("Finished evaluation.");

    /* Return list of value change events. */
    Object.keys(this.variables).forEach(function (v) {
      /* TODO: maybeChanged or isChanged? */
      if (this.variables[v].maybeChanged) {
        events.push(v + ".value");
      }
    }, this);
  };

  namespace.open("hotdrink.model.graph").EGraph = EGraph;

}());

