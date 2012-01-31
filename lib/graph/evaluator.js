/**
 * @fileOverview <p>{@link hotdrink.graph.Evaluator}</p>
 * @author John Freeman
 */

//provides("hotdrink.graph.Evaluator");

(function () {

  function shouldBeExecuted (m, model) {
    /* A method should be executed if it is new in the solution
     * graph or if it has any changed, used inputs. */
    return (model.planDiff.include(m)) ? (true) : (
      model.methods[m].inputs.some(function (v) {
        var vv = model.variables[v];
        /* TODO: Decide which tracking of changed-ness we want to use. Tracking
         * isChanged requires value regularity. Tracking maybeChanged does not,
         * but is more conservative, i.e. less precise. */
        //return vv.isChanged && vv.isUsed;
        return vv.maybeChanged && vv.isUsed;
      })
    );
  }

  var Evaluator = Class.create(
  /** @lends hotdrink.graph.Evaluator# */
  {
    /**
     * @param {hotdrink.graph.Model} model
     * @constructs
     * @class
     *   Used by {@link hotdrink.graph.EGraph} to run the evaluation phase.
     */
    initialize : function (model) {
      this.model = model;
      this.caller = null;
    },
    /**
     * Manages all bookkeeping related to assigning a computed value to a
     * variable.
     * @param {String} variable
     * @param {concept.model.Value} value
     * @private
     */
    writeOutput : function (v, value) {
      var vv = this.model.variables[v];
      var prevValue = vv.value;
      vv.value = value;
      if (value !== prevValue) {
        vv.isChanged = true;
      }
      vv.maybeChanged = true;
      /* isComputed has already been assigned for variables in a self-loop, but
       * not for other outputs. */
      vv.isComputed = true;
      LOG(v + " <= " + Object.toJSON(value));
    },
    /**
     * Lazily evaluate the value of a single variable that is not an output of
     * the current method.
     * @param {String} variable
     * @returns {concept.model.Value}
     * @see hotdrink.graph.Evaluator#last_eval1
     */
    eval1 : function (v) {
      LOG("eval1 (" + Object.toJSON(v) + ")"
          + ((this.caller == null) ? ("") : (" within " + this.caller)));
      var callerSaved = this.caller;
      /* TODO: Three state "isComputed" flag: isComputed, isNotComputed,
       * isComputing (so we can mark dependsOnSelf and remove lastEval1) */
      var vv = this.model.variables[v];
      if (!vv.isComputed) {
        vv.isComputed = true;
        var m = vv.writtenBy;
        if (m !== "") {
          var mm = this.model.methods[m];
          /* Need to pre-compute inputs in order to set the maybeChanged flag,
           * so we can determine if the method should be executed. */
          mm.inputs.forEach(function (u) {
            if (!this.model.variables[u].isComputed) {
              LOG("computing input " + u + " for " + m);
              this.caller = null;
              this.eval1(u);
            }
          }, this);

          if (shouldBeExecuted(m, this.model)) {
            mm.inputs.forEach(function (u) {
              mm.inputIsUsed[u] = false;
            });
            var outputs = mm.outputs;
            outputs.each(function (w) {
              this.model.variables[w].dependsOnSelf = false;
            }, this);
            LOG("start executing " + m);
            /* The method needs to make calls to this.eval1. */
            this.caller = m;
            var results = mm.execute(this);
            LOG("stop executing " + m);
            //writeDebug("outputs of " + m + ": " + outputs);
            //writeDebug("results of " + m + ": " + results);
            if (outputs.size() === 1) {
              ASSERT(v === outputs[0],
                "Unexpected output variable!");
              LOG("single output from " + m + ":");
              this.writeOutput(v, results);
            } else {
              ASSERT(Object.isArray(results),
                "Method should return array for multiple output!");
              ASSERT(results.size() === outputs.size(),
                "Method should return correct number of outputs!");
              LOG("multiple outputs from " + m + ":");
              outputs.forEach(function (v, index) {
                this.writeOutput(v, results[index]);
              }, this);
            }
          }
        }
      }
      this.caller = callerSaved;
      if (this.caller !== null) {
        this.model.methods[this.caller].inputIsUsed[v] = true;
      }
      LOG("returning " + v + " == " + Object.toJSON(vv.value));
      return vv.value;
    },
    /**
     * Return the last value of a single variable that is an output of the
     * current method.
     * @param {String} variable
     * @returns {concept.model.Value}
     * @see hotdrink.graph.Evaluator#eval1
     */
    last_eval1 : function (v) {
      LOG("last_eval1 (" + Object.toJSON(v) + ")"
          + ((this.caller == null) ? ("") : (" within " + this.caller)));
      var vv = this.model.variables[v];
      vv.dependsOnSelf = true;
      if (this.caller !== null) {
        this.model.methods[this.caller].inputIsUsed[v] = true;
      }
      LOG("returning " + v + " == " + Object.toJSON(vv.value));
      return vv.value;
    },
    /**
     * Call {@link hotdrink.graph.Evaluator#eval1} on a set of variables.
     * @param {String[]} variables
     * @see hotdrink.graph.Evaluator#eval1
     */
    evalmany : function (V) {
      LOG("evalmany (" + Object.toJSON(V) + ")");
      V.forEach(function (v) {
        this.eval1(v);
      }, this);
    }
  });

  var ns = namespace.open("hotdrink.graph");
  ns.Evaluator = Evaluator;

}());

