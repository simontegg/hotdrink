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
      this.priority = Object.keys(this.variables);

      /**
       * @property {String[]} changedSet
       *   List of variables that have been changed since the last call to
       *   update. The user can set multiple variables before updating, so we
       *   need to keep track of all changes. Consequently, for the first call
       *   to update, this should contain the names of all variables. */
      this.changedSet = Object.keys(this.variables);
      /**
       * @property {Boolean} needsSolution
       *   If user edited a new value, then must solve and evaluate.
       *   If edited same value, can just re-evaluate. */
      this.needsSolution = true;

      this.plan = [];
      this.planDiff = [];

      this.solver = new hotdrink.graph.Solver(this);
    },

    /**
     * Mark a variable as changed and promote its priority.
     * @param {String} v Variable name.
     * @private
     */
    touch : function (v) {
      this.changedSet.push(v);
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

      /* WARNING: Don't erase old solution yet - the solver can use it. */

      /* Solve. */
      var plan = this.solver.solve(this.priority);

      /* Erase old solution. */
      Object.keys(this.variables).forEach(function (v) {
        this.variables[v].writtenBy = "";
      }, this);

      Object.keys(this.methods).forEach(function (mm) {
        this.methods[m].isSelected = false;
      }, this);

      /* Write new solution. */
      /* TODO: plan.length === cgraph.constraints.size() */
      ASSERT(plan.length > 0,
        "no solution found");
      this.planDiff = setDifference(plan, this.plan);
      this.plan = plan;
      this.needsSolution = false;

      /* For each method named in the plan, */
      plan.forEach(function (m) {
        /* Set the writtenBy field of its outputs. */
        var mm = this.methods[m];
        mm.isSelected = true;
        mm.outputs.forEach(function (v) {
          this.variables[v].writtenBy = m;
        }, this);
      }, this);

      LOG("Finished solution.");
    }

  };

  var ns = namespace.open("hotdrink.graph");
  ns.SGraph = SGraph;

}());

