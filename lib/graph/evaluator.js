/**
 * @fileOverview <p>{@link hotdrink.graph.Evaluator}</p>
 * @author John Freeman
 */

//provides("hotdrink.graph.Evaluator");

(function () {

  function shouldBeExecuted (m, egraph) {
    /* A method should be executed if it is a constant method (i.e. has no
     * inputs) or if it has any changed, used inputs. */
    /* TODO: A method should be executed if it is new (requires a new flag on
     * methods in the sgraph) or if it has any changed, used inputs. */
    var inputs = egraph.methods.get(m).inputs;
    return (inputs.size() === 0) ? (true) : (
      inputs.any(function (pair) {
        /* TODO: Decide which tracking of changed-ness we want to use. Tracking
         * isChanged requires value regularity. Tracking maybeChanged does not,
         * but is more conservative, i.e. less precise. */
        //return egraph.variables.get(v).isChanged
        return egraph.variables.get(pair.key).maybeChanged
               && pair.value.isUsed;
      })
    );
  }

  var Evaluator = Class.create(
  /** @lends hotdrink.graph.Evaluator# */
  {
    /**
     * @param {hotdrink.graph.CGraph} cgraph
     * @param {hotdrink.graph.SGraph} sgraph
     * @param {hotdrink.graph.EGraph} egraph
     * @constructs
     * @class
     *   Used by {@link hotdrink.graph.EGraph} to run the evaluation phase.
     */
    initialize : function (cgraph, sgraph, egraph) {
      this.cgraph = cgraph;
      this.sgraph = sgraph;
      this.egraph = egraph;
      this.caller = null;
    },
    /**
     * Manages all bookkeeping related to assigning a computed value to a
     * variable.
     * @param {String} variable
     * @param {concept.Value} value
     * @private
     */
    writeOutput : function (v, value) {
      var ev = this.egraph.variables.get(v);
      var previous_value = ev.value;
      ev.value = value;
      if (value !== previous_value) {
        ev.isChanged = true;
      }
      ev.maybeChanged = true;
      /* isComputed has already been assigned for variables in a self-loop, but
       * not for other outputs. */
      ev.isComputed = true;
      LOG(v + " <= " + Object.toJSON(value));
    },
    /**
     * Lazily evaluate the value of a single variable that is not an output of
     * the current method.
     * @param {String} variable
     * @returns {concept.Value}
     * @see hotdrink.graph.Evaluator#last_eval1
     */
    eval1 : function (v) {
      LOG("eval1 (" + Object.toJSON(v) + ")"
          + ((this.caller == null) ? ("") : (" within " + this.caller)));
      var callerSaved = this.caller;
      /* TODO: Three state "isComputed" flag: isComputed, isNotComputed,
       * isComputing (so we can mark dependsOnSelf and remove lastEval1) */
      var ev = this.egraph.variables.get(v);
      if (!ev.isComputed) {
        ev.isComputed = true;
        var m = this.sgraph.variables.get(v).writtenBy;
        if (m !== "") {
          /* Need to pre-compute inputs in order to set the maybeChanged flag,
           * so we can determine if the method should be executed. */
          var E = this;
          this.egraph.methods.get(m).inputs.each(function (pair) {
            if (!E.egraph.variables.get(pair.key).isComputed) {
              LOG("computing input " + pair.key + " for " + m);
              E.caller = null;
              E.eval1(pair.key);
            }
          });

          if (shouldBeExecuted(m, this.egraph)) {
            this.egraph.methods.get(m).inputs.each(function (pair) {
              pair.value.isUsed = false;
            });
            var E = this;
            var outputs = this.cgraph.methods.get(m).outputs;
            outputs.each(function (v) {
              E.egraph.variables.get(v).dependsOnSelf = false;
            });
            LOG("start executing " + m);
            /* The method needs to make calls to this.eval1. */
            this.caller = m;
            var results = this.egraph.methods.get(m).impl(this);
            LOG("stop executing " + m);
            //writeDebug("outputs of " + m + ": " + outputs);
            //writeDebug("results of " + m + ": " + results);
            if (outputs.size() === 1) {
              ASSERT(v === outputs[0],
                "Unexpected output variable!");
              LOG("single output from " + m + ":");
              E.writeOutput(v, results);
            } else {
              ASSERT(Object.isArray(results),
                "Method should return array for multiple output!");
              ASSERT(results.size() === outputs.size(),
                "Method should return correct number of outputs!");
              LOG("multiple outputs from " + m + ":");
              outputs.each(function (v, index) {
                E.writeOutput(v, results[index]);
              });
            }
          }
        }
      }
      this.caller = callerSaved;
      if (this.caller !== null) {
        this.egraph.methods.get(this.caller).inputs.get(v).isUsed = true;
      }
      LOG("returning " + v + " == " + Object.toJSON(ev.value));
      return ev.value;
    },
    /**
     * Return the last value of a single variable that is an output of the
     * current method.
     * @param {String} variable
     * @returns {concept.Value}
     * @see hotdrink.graph.Evaluator#eval1
     */
    last_eval1 : function (v) {
      LOG("last_eval1 (" + Object.toJSON(v) + ")"
          + ((this.caller == null) ? ("") : (" within " + this.caller)));
      var ev = this.egraph.variables.get(v);
      ev.dependsOnSelf = true;
      if (this.caller !== null) {
        this.egraph.methods.get(this.caller).inputs.get(v).isUsed = true;
      }
      LOG("returning " + v + " == " + Object.toJSON(ev.value));
      return ev.value;
    },
    /**
     * Call {@link hotdrink.graph.Evaluator#eval1} on a set of variables.
     * @param {String[]} variables
     * @see hotdrink.graph.Evaluator#eval1
     */
    evalmany : function (V) {
      LOG("evalmany (" + Object.toJSON(V) + ")");
      var E = this;
      V.each(function (v) {
        E.eval1(v);
      });
    }
  });

  var ns = namespace.open("hotdrink.graph");
  ns.Evaluator = Evaluator;

}());

