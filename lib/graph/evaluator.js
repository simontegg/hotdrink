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
      model.methods[m].inputsUsed.some(function (u) {
        /* TODO: Decide which tracking of changed-ness we want to use. Tracking
         * isChanged requires value regularity. Tracking maybeChanged does not,
         * but is more conservative, i.e. less precise. */
        //return model.variables[v].isChanged
        return model.variables[u].maybeChanged;
      })
    );
  };

  /**
   * Manages all bookkeeping related to assigning a computed value to a
   * variable.
   * @param {String} variable
   * @param {concept.model.Value} value
   * @private
   */
  var writeOutput = function (model, v, value) {
    var vv = model.variables[v];
    var prevValue = vv.value;
    vv.value = value;
    if (value !== prevValue) {
      vv.isChanged = true;
    }
    vv.maybeChanged = true;
    LOG(v + " <= " + Object.toJSON(value));
  };

  /**
   * @param {hotdrink.graph.Model} model
   * @class
   *   Used by {@link hotdrink.graph.EGraph} to run the evaluation phase.
   */
  var Evaluator = function (model) {
    var self = this;

    self.model = model;
    self.caller = null;
    self.proxy = {};
    Object.keys(model.variables).forEach(function (v) {
      self.proxy[v] = function () { return self.get(v); };
    });
  };

  Evaluator.prototype = {

    /**
     * Lazily evaluate the value of a single variable that is not an output of
     * the current method.
     * @param {String} variable
     * @returns {concept.model.Value}
     */
    get : function (v) {
      LOG("get (" + Object.toJSON(v) + ")"
          + ((this.caller == null) ? ("") : (" within " + this.caller)));
      var vv = this.model.variables[v];

      if (this.caller !== null) {
        this.model.methods[this.caller].inputsUsed.push(v);
        if (this.caller === vv.writtenBy) {
          vv.dependsOnSelf = true;
        }
      }

      if (vv.needsWrite) {
        var m = vv.writtenBy;
        if (m !== "") {
          var mm = this.model.methods[m];

          var outputs = mm.outputs;
          outputs.each(function (w) {
            this.model.variables[w].needsWrite = false;
          }, this);

          var callerSaved = this.caller;

          /* Need to pre-compute inputs in order to set the maybeChanged flag,
           * so we can determine if the method should be executed. We call
           * this.get with an empty caller so that we don't mark the variable
           * used. */
          this.caller = null;
          mm.inputsUsed.forEach(function (u) {
            LOG("computing input " + u + " for " + m);
            this.get(u);
          }, this);

          if (shouldBeExecuted(m, this.model)) {
            /* Prepare the surrounding graph. */
            mm.inputsUsed = [];
            outputs.each(function (w) {
              this.model.variables[w].dependsOnSelf = false;
            }, this);

            /* Lazily evaluate. */
            LOG("start executing " + m);
            /* The method may call this.get. */
            this.caller = m;
            var results = mm.execute.call(this.proxy);
            LOG("stop executing " + m);
            //LOG("outputs of " + m + ": " + outputs);
            //LOG("results of " + m + ": " + results);

            /* Assign outputs. */
            if (outputs.size() === 1) {
              ASSERT(v === outputs[0],
                "Unexpected output variable!");
              LOG("single output from " + m + ":");
              writeOutput(this.model, v, results);
            } else {
              ASSERT(Object.isArray(results),
                "Method should return array for multiple output!");
              ASSERT(results.size() === outputs.size(),
                "Method should return correct number of outputs!");
              LOG("multiple outputs from " + m + ":");
              outputs.forEach(function (v, index) {
                writeOutput(this.model, v, results[index]);
              }, this);
            }
          }

          this.caller = callerSaved;
        }
      }

      LOG("returning " + v + " == " + Object.toJSON(vv.value));
      return vv.value;
    },

    /**
     * Call {@link hotdrink.graph.Evaluator#get} on a set of variables.
     * @param {String[]} variables
     * @see hotdrink.graph.Evaluator#get
     */
    evalMany : function (V) {
      LOG("evalmany (" + Object.toJSON(V) + ")");
      V.forEach(function (v) {
        this.get(v);
      }, this);
    }

  };

  var ns = namespace.open("hotdrink.graph");
  ns.Evaluator = Evaluator;

}());

