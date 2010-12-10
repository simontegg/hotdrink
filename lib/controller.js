/**
 * @fileOverview <p>{@link hotdrink.controller}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller");

//requires("hotdrink.controller.html");
//requires("hotdrink.controller.model");

(function () {

  /**
   * @name hotdrink.controller
   * @namespace
   *   Utilities for binding views to models. Each widget library, including
   *   basic HTML form elements, is supported separately, but in a pluggable
   *   manner.
   */
  namespace.extend("hotdrink.controller", {
    /**
     * @name makeModelController
     * @memberOf hotdrink.controller
     * @function
     * @param {hotdrink.Model} model
     * @returns {hotdrink.controller.ModelController}
     */
    makeModelController : function (model) {
      return new hotdrink.controller.ModelController(model);
    }
  });

}());

