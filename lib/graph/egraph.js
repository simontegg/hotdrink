/**
 * @fileOverview <p>{@link hotdrink.graph.EGraph}</p>
 * @author John Freeman
 */

//provides("hotdrink.graph.EGraph");

//requires("hotdrink.graph.Evaluator");

(function () {

  var EGraphVariable = Class.create({
    initialize : function () {
      this.value = null;
      this.hasBeenEdited = false;
      this.isComputed = false;
      this.isChanged = true;
      this.maybeChanged = true;
      this.dependsOnSelf = false;
    }
  });

  var EGraphMethod = Class.create({
    initialize : function () {
      this.inputs = new Hash();
      this.code = null;
    }
  });

  var EGraphMethodInput = Class.create({
    initialize : function () {
      this.isUsed = true;
    }
  });

  /* Provides hash table interface for values stored in EGraph. */
  var ValuesTable = Class.create({
    initialize : function (egraph) {
      this.variables = egraph.variables;
    },
    get : function (v) {
      return this.variables.get(v).value;
    },
    set : function (v, value) {
      this.variables.get(v).value = value;
    },
    toString : function () {
      var result = "{";
      var first = true;
      this.variables.each(function (pair) {
        if (first) {
          first = false;
        } else {
          result += ", ";
        }
        result += "\"" + pair.key + "\" : " + Object.toJSON(pair.value.value);
      });
      result += "}";
      return result;
    }
  });

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

  var EGraph = Class.create(
  /** @lends hotdrink.graph.EGraph# */
  {
    /**
     * @param {hotdrink.graph.CGraph} cgraph
     * @param {Object:MethodRegistry} methodRegistry
     *   JavaScript functions that implement the methods in the above constraint
     *   graph. This object can be obtained by parsing an Adam specification.
     *   <pre>
     *   MethodRegistry ::=
     *   {
     *     /method-name/ : function (E) { ... },
     *     ...
     *   }
     *   </pre>
     *
     * @constructs
     * @class
     *   Represents the evaluation graph within {@link hotdrink.Model}. Nearly
     *   models {@link concept.model.Behavior}.
     */
    initialize : function (cgraph, methodRegistry) {
      var egraph = this;

      /* Allocate. */
      this.variables = new Hash();
      cgraph.variables.keys().each(function (v) {
        egraph.variables.set(v, new EGraphVariable());
      });

      this.methods = new Hash();
      cgraph.methods.each(function (pair) {
        var m = pair.key;
        var em = new EGraphMethod();
        em.impl = methodRegistry[m];
        pair.value.inputs.each(function (v) {
          em.inputs.set(v, new EGraphMethodInput());
        });
        egraph.methods.set(m, em);
      });

      this.values = new ValuesTable(this);

      cgraph.variables.each(function (pair) {
        /* Initializer may be undefined. This case is handled in
         * initializeValue(). Wouldn't hurt to ensure that every variable has an
         * "initializer", even if just null. */
        initializeValue(egraph.values, pair.key, pair.value.initializer);
      });
    },
    /**
     * Runs the {@link hotdrink.graph.Evaluator}.
     * @param {hotdrink.graph.CGraph} cgraph
     * @param {hotdrink.graph.SGraph} sgraph
     * @param {String[]} changeSet
     *   List of variables that have had their values edited since the last call
     *   to update. Consequently, the first call should contain the names of all
     *   variables.
     * @returns {String[]}
     *   List of value change events in the form "variable.value".
     * @see concept.model.Behavior#update
     */
    update : function (cgraph, sgraph, changeSet) {
      var egraph = this;

      this.variables.each(function (pair) {
        var ev = pair.value;
        ev.isComputed = false;
        ev.isChanged = false;
        ev.maybeChanged = false;
        ev.dependsOnSelf = false;
      });
      changeSet.each(function (v) {
        var ev = egraph.variables.get(v);
        ev.isChanged = true;
        ev.maybeChanged = true;
      });

      /* TODO: Could the evaluator benefit from saving information across
       * updates? */
      var E = new hotdrink.graph.Evaluator(cgraph, sgraph, this);
      E.evalmany(cgraph.variables.keys());

      var result = [];
      this.variables.each(function (pair) {
        /* TODO: maybeChanged or isChanged? */
        if (pair.value.maybeChanged) {
          result.push(pair.key + ".value");
        }
      });
      LOG("evaluator events: " + Object.toJSON(result));
      return result;
    }
  });

  var ns = namespace.open("hotdrink.graph");
  ns.EGraph = EGraph;

}());

