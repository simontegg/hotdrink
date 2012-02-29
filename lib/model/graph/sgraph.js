/**
 * @fileOverview <p>{@link hotdrink.model.graph.SGraph}</p>
 * @author John Freeman
 */

//provides("hotdrink.model.graph.SGraph");

//requires("hotdrink.model.graph.Solver");

(function () {

  /** @lends hotdrink.graph.SGraph# */
  var SGraph = {};

  /**
   * @constructs
   * @class
   *   Represents the solution graph within {@link hotdrink.Model}.
   *   Models {@link concept.model.Behavior}.
   */
  SGraph.initialize = function initialize() {
    /**
     * @property {Boolean} needsSolution
     *   If user edited a new value, then must solve and evaluate.
     *   If edited same value, can just re-evaluate. */
    this.needsSolution = true;

    this.plan = [];
    this.planDiff = [];

    this.solver = new hotdrink.model.graph.Solver(this);
    this.priority = Object.keys(this.variables);
  };

  /**
   * Mark a variable as changed and promote its priority.
   * @param {String} v Variable name.
   * @private
   */
  SGraph.touch = function touch(v) {
    if (v !== this.priority[0]) {
      this.priority.splice(this.priority.indexOf(v), 1);
      this.priority.unshift(v);
      this.needsSolution = true;
    }
  };

  SGraph.update = function update() {
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
  };

  namespace.open("hotdrink.model.graph").SGraph = SGraph;

}());

