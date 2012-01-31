/**
 * @fileOverview <p>{@link hotdrink.Model}</p>
 * @author John Freeman
 */

//provides("hotdrink.Model");

//requires("hotdrink.graph.CGraph");
//requires("hotdrink.graph.SGraph");
//requires("hotdrink.graph.EGraph");

(function () {

    /**
     * @param {Object:CGraphAst} cgraph Forwarded to {@link hotdrink.graph.CGraph}.
     * @see hotdrink.graph.CGraph For documentation on the CGraphAst type.
     *
     * @param {Object:MethodRegistry} methodRegistry
     *   Forwarded to {@link hotdrink.graph.EGraph}.
     * @see hotdrink.graph.EGraph For documentation on the MethodRegistry type.
     *
     * @param {Object} [inputs={}]
     *   Initial values for input variables.
     *
     * @class
     *   <p>
     *   The model manages the constraint system, priority, values, and
     *   plugged-in behaviors.  It provides a limited interface to the
     *   underlying system for two different clients: behaviors and views.
     *   </p>
     *
     *   <p>
     *   Behaviors need access to all information in the three fundamental graphs
     *   (constraint, solution, evaluation), and possibly in other behaviors.
     *   Views need access to information on (hopefully) just the variables in the
     *   three graphs and other behaviors.
     *   </p>
     *
     *   <p>
     *   There are workarounds for implementing access control in JavaScript, but
     *   as the project is young, we will not expend that effort on a policy that
     *   is subject to change as more requirements are discovered. For now, access
     *   control will simply be documented.
     *   </p>
     */
  var Model = function (cgraph, methodRegistry, inputs) {

    this.updaters = [];

    var behaviors = [
      hotdrink.graph.CGraph,
      hotdrink.graph.SGraph,
      hotdrink.graph.EGraph
    ];

    behaviors.forEach(function (behavior) {
      Object.keys(behavior).forEach(function (f) {
        if (f === "initialize") {
          /* TODO: Need a better way to pass parameters to behaviors. */
          behavior[f].call(this, cgraph, methodRegistry, inputs);
        } else if (f === "update") {
          this.updaters.push(behavior[f]);
        } else if (typeof behavior[f] === "function") {
          ASSERT(this[f] === undefined,
            "non-unique name (" + f + ") for behavioral extension");
          this[f] = behavior[f];
        } else {
          ERROR("unsupported property (" + f + ") on behavior");
        }
      }, this);
    }, this);

    this.update();
  };

  Model.prototype = {
    /**
     * <p>
     * Possibly solve and evaluate the model, then update all registered behaviors.
     * </p>
     *
     * <p>
     * To allow several variables to be set without triggering an update, this
     * function must be called separately.
     * </p>
     *
     * @returns {String[]}
     *   List of change events including those returned from
     *   {@link hotdrink.graph.EGraph#update} and registered
     *   {@link concept.model.Behavior}s.
     * @see concept.model.Behavior#update
     */
    update : function () {
      var events = [];

      this.updaters.forEach(function (updater) {
        var result = updater.call(this);
        if (Object.isArray(result)) {
          events = events.concat(result);
        }
      }, this);

      return events;
    }
  };

  var ns = namespace.open("hotdrink");
  ns.Model = Model;

}());

