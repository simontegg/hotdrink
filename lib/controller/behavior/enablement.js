/**
 * @fileOverview <p>{@link hotdrink.controller.behavior.enablement}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.behavior.enablement);

(function () {

  /**
   * @name bindEnablement
   * @memberOf hotdrink.controller.behavior.enablement
   * @description
   *   Registers a listener with the model. The listener will call disable or
   *   enable on the view whenever {@link hotdrink.behavior.EnablementGraph}
   *   signals that the bound variable can or cannot be disabled, respectively.
   * @public
   * @static
   * @function
   * @param {hotdrink.controller.ModelController} model
   * @param {String} variable
   * @param {concept.view.Controller -> ()} enable
   * @param {concept.view.Controller -> ()} disable
   * @param {concept.view.Controller} view
   */
  var bindEnablement = function (model, v, enable, disable, view) {

    var listener = function (model2) {
      ASSERT(model2 === model,
        "listening for one model, but heard another");
      /* TODO: Need better way of accessing variable information. */
      if (model.model.behaviors.get("enablement").variables.get(v).canBeDisabled) {
        LOG("disabling #" + view.identify());
        disable(view);
      } else {
        LOG("enabling #" + view.identify());
        enable(view);
      }
    };

    model.observe(v + ".canBeDisabled", listener);

  };

  /**
   * @name hotdrink.controller.behavior.enablement
   * @namespace
   *   Support enablement and disablement of widgets. Model of
   *   {@link concept.view.Behavior}.
   */
  namespace.extend("hotdrink.controller.behavior.enablement", {
    bindEnablement : bindEnablement
  });

}());

