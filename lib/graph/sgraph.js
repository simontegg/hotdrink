/**
 * @fileOverview <p>{@link hotdrink.graphSGraph}</p>
 * @author John Freeman
 */

//provides("hotdrink.graph.SGraph");

//requires("hotdrink.graph.Solver");

(function () {

  var SGraphVariable = Class.create({
    initialize : function () {
      /* The method, not the contraint, in the solution that writes this variable. */
      this.writtenBy = "";
    },
    isSource : function () {
      return this.writtenBy === "";
    }
  });

  var SGraphMethod = Class.create({
    initialize : function () {
      this.isSelected = false;
    }
  });

  /* Solution graph */
  var SGraph = Class.create(
  /** @lends hotdrink.graph.SGraph# */
  {
    /**
     * @param {hotdrink.graph.CGraph} cgraph
     * @constructs
     * @class
     *   Represents the solution graph within {@link hotdrink.Model}. Nearly
     *   models {@link concept.model.Behavior}.
     */
    initialize : function (cgraph) {
      var sgraph = this;

      /* Allocate. */
      this.variables = new Hash();
      cgraph.variables.keys().each(function (v) {
        sgraph.variables.set(v, new SGraphVariable());
      });
      this.methods = new Hash();
      cgraph.methods.keys().each(function (m) {
        sgraph.methods.set(m, new SGraphMethod());
      });

      this.plan = [];
      this.planDiff = [];

      this.solver = new hotdrink.graph.Solver(cgraph);
    },
    /**
     * Runs the QuickPlan solver.
     * @param {hotdrink.grpah.CGraph} cgraph Unused at the moment.
     * @param {String[]} priority
     */
    update : function (cgraph, priority) {
      var sgraph = this;

      var plan = this.solver.solve(priority);
      /* TODO: plan.length === cgraph.constraints.size() */
      ASSERT(plan.length > 0,
        "no solution found");
      this.planDiff = setDifference(plan, this.plan);
      this.plan = plan;

      /* Initialize. */
      this.variables.each(function (pair) {
        pair.value.writtenBy = "";
      });
      this.methods.each(function (pair) {
        pair.value.isSelected = false;
      });
      /* For each method named in the plan, */
      plan.each(function (m) {
        /* Set the writtenBy field of its outputs. */
        sgraph.methods.get(m).isSelected = true;
        cgraph.methods.get(m).outputs.each(function (v) {
          sgraph.variables.get(v).writtenBy = m;
        });
      });
    }
  });

  var ns = namespace.open("hotdrink.graph");
  ns.SGraph = SGraph;

}());

