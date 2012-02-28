/**
 * @fileOverview <p>{@link hotdrink.graph.CGraph}</p>
 * @author John Freeman
 */

//provides("hotdrink.graph.CGraph");

(function () {

  /* TODO: Handle the other cell types. */
  var cellTypeSwitch = {
    /* Have to wrap property names in quotes because "interface" is an invalid
     * name? */
    "interface" : "interfaces",
    "output" : "outputs",
    "invariant" : "invariants"
  };

  /**
   * @memberOf hotdrink.graph
   * @class
   *   Represents the constraint graph within {@link hotdrink.Model}.
   *   Models {@link concept.model.Behavior}.
   *
   *   <pre>
   *   CGraph ::=
   *   {
   *     variables : {
   *       /variable-name/ : {
   *         cellType : /cell-type/,
   *         potentiallyUsedBy : /method-name-list/,
   *           // An array, possibly empty, of names of methods for which I am
   *           // an input.
   *         initializer? : /expression/
   *       },
   *       ...
   *     },
   *     methods : {
   *       /method-name/ : {
   *         outputs : /variable-name-list/
   *       },
   *       ...
   *     },
   *     constraints : {
   *       /constraint-name/ : {
   *         methods : /method-name-list/
   *       },
   *       ...
   *     }
   *   }
   *   </pre>
   */
  var CGraph = {

    initialize : function (cgraph) {
      this.variables = cgraph.variables;
      this.methods = cgraph.methods;
      this.constraints = cgraph.constraints;

      this.interfaces = [];
      this.outputs = [];
      this.invariants = [];

      Object.keys(this.variables).forEach(function (v) {
        var cellTypeSet = cellTypeSwitch[this.variables[v].cellType];
        if (cellTypeSet) {
          this[cellTypeSet].push(v);
        }
      }, this);

      Object.keys(this.constraints).forEach(function (c) {
        this.constraints[c].methods.forEach(function (m) {
          this.methods[m].constraint = c;
        }, this);
      }, this);
    }

  };

  /**
   * @name hotdrink.graph
   * @namespace
   *   Namespace for the three graphs that {@link hotdrink.Model} depends upon.
   */
  var ns = namespace.open("hotdrink.graph");
  ns.CGraph = CGraph;

}());

