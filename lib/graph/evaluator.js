/**
 * @fileOverview <p>{@link hotdrink.graph.Evaluator}</p>
 * @author John Freeman
 */

//provides("hotdrink.graph.Evaluator");

(function () {

  var shouldBeExecuted = function (m, model) {
    /* A method should be executed if it is new in the solution
     * graph or if it has any changed, used inputs. */
    return (model.planDiff.include(m)) ? (true) : (
      model.methods[m].inputs.some(function (u) {
        /* TODO: Decide which tracking of changed-ness we want to use. Tracking
         * isChanged requires value regularity. Tracking maybeChanged does not,
         * but is more conservative, i.e. less precise. */
        //return model.variables[v].isChanged
        return model.variables[u].maybeChanged
          && (model.methods[m].inputsUsed.indexOf(u) >= 0); /* includes */
      })
    );
  };

  /*
  m4_define(<{IS_NOT_COMPUTED}>, 0)
  m4_define(<{IS_COMPUTED}>, 1)
  m4_define(<{IS_COMPUTING}>, 2)
  */

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
      vv.isComputed = IS_COMPUTED;
      LOG(v + " <= " + Object.toJSON(value));
    },
    eval1 : function (v) { return this.eval(v); },
    last_eval1 : function (v) { return this.eval(v); },
    /**
     * Lazily evaluate the value of a single variable that is not an output of
     * the current method.
     * @param {String} variable
     * @returns {concept.model.Value}
     */
    eval : function (v) {
      LOG("eval (" + Object.toJSON(v) + ")"
          + ((this.caller == null) ? ("") : (" within " + this.caller)));
      var vv = this.model.variables[v];

      if (this.caller !== null) {
        this.model.methods[this.caller].inputsUsed.push(v);
        if (vv.isComputed === IS_COMPUTING) {
          ASSERT(vv.writtenBy === this.caller,
            "only self-loops are allowed");
          vv.dependsOnSelf = true;
        }
      }

      if (vv.isComputed === IS_NOT_COMPUTED) {
        vv.isComputed = IS_COMPUTING;

        var callerSaved = this.caller;

        var m = vv.writtenBy;
        if (m !== "") {
          var mm = this.model.methods[m];

          /* Need to pre-compute inputs in order to set the maybeChanged flag,
           * so we can determine if the method should be executed. We call
           * this.eval with an empty caller so that we don't mark the variable
           * used. */
          this.caller = null;
          mm.inputs.forEach(function (u) {
            LOG("computing input " + u + " for " + m);
            this.eval(u);
          }, this);

          if (shouldBeExecuted(m, this.model)) {
            /* Prepare the surrounding graph. */
            mm.inputsUsed = [];
            var outputs = mm.outputs;
            outputs.each(function (w) {
              this.model.variables[w].dependsOnSelf = false;
            }, this);

            /* Lazily evaluate. */
            LOG("start executing " + m);
            /* The method needs to make calls to this.eval. */
            this.caller = m;
            var results = mm.execute(this);
            LOG("stop executing " + m);
            //LOG("outputs of " + m + ": " + outputs);
            //LOG("results of " + m + ": " + results);

            /* Assign outputs. */
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

        this.caller = callerSaved;

        /* In case this variable is a source. */
        vv.isComputed = IS_COMPUTED;
      }

      LOG("returning " + v + " == " + Object.toJSON(vv.value));
      return vv.value;
    },
    /**
     * Call {@link hotdrink.graph.Evaluator#eval} on a set of variables.
     * @param {String[]} variables
     * @see hotdrink.graph.Evaluator#eval
     */
    evalmany : function (V) {
      LOG("evalmany (" + Object.toJSON(V) + ")");
      V.forEach(function (v) {
        this.eval(v);
      }, this);
    }
  });

  var ns = namespace.open("hotdrink.graph");
  ns.Evaluator = Evaluator;

}());

