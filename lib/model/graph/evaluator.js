/**
 * @fileOverview <p>{@link hotdrink.model.graph.Evaluator}</p>
 * @author John Freeman
 */

//provides("hotdrink.model.graph.Evaluator");

(function () {

  var shouldBeExecuted = function (m, model) {
    /* A method should be executed if it is new in the solution
     * graph or if it has any changed, used inputs. */
    return (contains(model.planDiff, m)) ? (true) : (
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
   * @param {hotdrink.graph.Model} model
   * @class
   *   Used by {@link hotdrink.graph.EGraph} to run the evaluation phase.
   */
  var Evaluator = function Evaluator(model) {
    var self = this;

    self.model = model;
    self.caller = null;
    self.proxy = {};
    Object.keys(model.variables).forEach(function (v) {
      var cellType = model.getMore(v).cellType;
      if (cellType === "constant") {
        /* Copy constant over. */
        var getter = model.get(v);
      } else if (cellType === "interface" || cellType === "logic") {
        /* Use getter that goes through lazy evaluation. */
        var getter = function () {
          if (arguments.length > 0) {
            throw Error("cannot set values from within methods: " + v);
          } else {
            return self.get(v);
          }
        };
      } else if (cellType === "output") {
        /* Do not make commands available in methods. */
        var getter = function () {
          throw Error("commands unavailable in methods: " + v);
        };
      } else {
        /* Ignore invariants. */
        ASSERT(cellType === "invariant", "proxy: unhandled cell type");
        //var getter = null;
      }
      self.proxy[v] = getter;
    });
  };

  /**
   * Lazily evaluate the value of a single variable that is not an output of
   * the current method.
   * @param {String} variable
   * @returns {concept.model.Value}
   */
  Evaluator.prototype.get = function get(v) {
    LOG("get (" + JSON.stringify(v) + ")"
        + ((this.caller == null) ? ("") : (" within " + this.caller)));
    var vv = this.model.variables[v];

    /* We want to record this only the first time get(v) is called. */
    if (this.caller !== null && !contains(vv.usedBy, this.caller)) {
      LOG(v + " is used by " + this.caller);
      vv.usedBy.push(this.caller);
      this.model.methods[this.caller].inputsUsed.push(v);
    }

    /* I believe will get set for source variables as well. */
    if (this.caller === vv.writtenBy) {
      vv.dependsOnSelf = true;
    }

    if (vv.needsWrite) {
      /* Set for source variables that have no writtenBy. */
      vv.needsWrite = false;

      var m = vv.writtenBy;
      if (m !== "") {
        var mm = this.model.methods[m];

        var outputs = mm.outputs;
        /* Prevent endless looping on self-loops. */
        outputs.forEach(function (w) {
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
          outputs.forEach(function (w) {
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
          if (outputs.length === 1) {
            ASSERT(v === outputs[0],
              "Unexpected output variable!");
            LOG("single output from " + m + ":");
            this.set(v, results);
          } else {
            ASSERT(Array.isArray(results),
              "Method should return array for multiple output!");
            ASSERT(results.length === outputs.length,
              "Method should return correct number of outputs!");
            LOG("multiple outputs from " + m + ":");
            outputs.forEach(function (v, index) {
              this.set(v, results[index]);
            }, this);
          }
        } else {
          /* We won't be calling the function, but we already cleared the
           * usedBy of all of its inputs. Reset that here. */
           mm.inputsUsed.forEach(function (u) {
             LOG(v + " would have been used by " + m);
             this.model.variables[u].usedBy.push(m);
           }, this);
        }

        this.caller = callerSaved;
      }
    }

    LOG("returning " + v + " == " + JSON.stringify(vv.value));
    return vv.value;
  };

  /**
   * Set an output variable.
   * @param {String} variable
   * @param {concept.model.Value} value
   * @private
   */
  Evaluator.prototype.set = function set(v, value) {
    var vv = this.model.variables[v];
    var prevValue = vv.value;
    vv.value = value;
    if (value !== prevValue) {
      vv.isChanged = true;
    }
    vv.maybeChanged = true;
    LOG(v + " <= " + JSON.stringify(value));
  };

  /**
   * Call {@link hotdrink.graph.Evaluator#get} on a set of variables.
   * @param {String[]} variables
   * @see hotdrink.graph.Evaluator#get
   */
  Evaluator.prototype.evalMany = function evalMany(V) {
    LOG("evalmany (" + JSON.stringify(V) + ")");
    V.forEach(function (v) {
      this.get(v);
    }, this);
  }

  namespace.open("hotdrink.model.graph").Evaluator = Evaluator;

}());

