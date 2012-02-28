/**
 * @fileOverview <p>{@link hotdrink.graphSGraph}</p>
 * @author John Freeman
 */

//provides("hotdrink.graph.SGraph");

//requires("hotdrink.graph.Solver");

(function () {

  var SGraph =
  /** @lends hotdrink.graph.SGraph# */
  {

    /**
     * @constructs
     * @class
     *   Represents the solution graph within {@link hotdrink.Model}.
     *   Models {@link concept.model.Behavior}.
     */
    initialize : function () {
      /**
       * @property {Boolean} needsSolution
       *   If user edited a new value, then must solve and evaluate.
       *   If edited same value, can just re-evaluate. */
      this.needsSolution = true;

      this.plan = [];
      this.planDiff = [];

      this.solver = new hotdrink.graph.Solver(this);
      this.priority = Object.keys(this.variables);
    },

    /**
     * Mark a variable as changed and promote its priority.
     * @param {String} v Variable name.
     * @private
     */
    touch : function (v) {
      if (v !== this.priority[0]) {
        this.priority.splice(this.priority.indexOf(v), 1);
        this.priority.unshift(v);
        this.needsSolution = true;
      }
    },

    update : function () {
      /* Skip if we can. */
      if (!this.needsSolution) {
        LOG("Reusing last solution.");
        return;
      }

      LOG("Solving...");

      /* Solve. */
      var plan = this.solver.solve(this.priority);

      /* Use new solution. */
      ASSERT(plan.length > 0,
        "no solution found");
      this.planDiff = setDifference(plan, this.plan);
      this.plan = plan;
      this.needsSolution = false;

      LOG("Finished solution.");
    }

  };

  var ns = namespace.open("hotdrink.graph");
  ns.SGraph = SGraph;

}());

