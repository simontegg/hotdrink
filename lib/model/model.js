/**
 * @fileOverview <p>{@link hotdrink.model.Model}</p>
 * @author John Freeman
 */

//provides("hotdrink.model.Model");

//requires("hotdrink.model.graph.CGraph");
//requires("hotdrink.model.graph.SGraph");
//requires("hotdrink.model.graph.EGraph");

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
  var Model = function Model(cgraph) {

    var initializers = [];

    this.updaters = [];

    var behaviors = [
      hotdrink.model.graph.CGraph,
      hotdrink.model.graph.SGraph,
      hotdrink.model.graph.EGraph,
      hotdrink.model.behavior.Enablement
    ];

    behaviors.forEach(function (behavior) {
      Object.keys(behavior).forEach(function (f) {
        var ff = behavior[f];
        if (f === "initialize") {
          /* We want to let initializers use their behavior's extensions, so we
           * wait to call them until after we have extended the model. */
          initializers.push(ff);
        } else if (f === "update") {
          this.updaters.push(ff);
        } else if (typeof ff === "function") {
          ASSERT(this[f] === undefined,
            "non-unique name (" + f + ") for behavioral extension");
          this[f] = ff;
        } else {
          ERROR("unsupported property (" + f + ") on behavior");
        }
      }, this);
    }, this);

    initializers.forEach(function (initializer) {
      /* TODO: Need a better way to pass parameters to behaviors. */
      initializer.call(this, cgraph);
    }, this);

    this.update();
  };

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
  Model.prototype.update = function update() {
    var events = [];

    this.updaters.forEach(function (updater) {
      var result = updater.call(this, events);
    }, this);

    return events;
  };

  namespace.open("hotdrink.model").Model = Model;

}());

