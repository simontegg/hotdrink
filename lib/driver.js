/**
 * @fileOverview <p>{@link hotdrink}</p>
 * @author John Freeman
 */

//provides("hotdrink");

//requires("hotdrink.model");
//requires("hotdrink.controller.*");

(function () {

  var maybeParseAdam = function (params) {
    if (typeof params.adam === "string") {
      ASSERT(!(("cgraph" in params) || ("methods" in params)),
        "do not pass both parsed and unparsed model specifications");
      try {
        /* pr = _p_arse _r_esults */
        var pr = hotdrink.parser.ModelParser.parse(params.adam);
        params.cgraph = pr.cgraph;
        params.methods = pr.methods;
      } catch (e) {
        raid.error(e);
      }
    }
  };

  /**
   * @name makeModelController
   * @memberOf hotdrink
   * @description
   *   TODO
   * @public
   * @static
   * @function
   * @param {Object:OpenDialogParams} params
   *   TODO
   */
  var makeModelController = function (params) {

    maybeParseAdam(params);
    if (!(params.cgraph && params.methods)) {
      /* Cannot proceed. */
      return null;
    }

    /* TODO: Is there a better string representation for the methods? */
    var methods = eval("Object(" + params.methods + ")");

    if (typeof params.inputs !== "object") {
      params.inputs = {};
    }

    var model = new hotdrink.Model(params.cgraph, methods, params.inputs);
    var modelController = hotdrink.controller.makeModelController(model);

    return modelController;

  };

  var makeFactory = function () {
    var factory = new hotdrink.controller.Factory();
    hotdrink.controller.view.html.registerWidgetsForBuild(factory);
    return factory;
  };

  var maybeParseEve = function (params) {
    if (typeof params.eve === "string") {
      ASSERT(!("trees" in params),
       "do not pass both parsed and unparsed view specifications");
      try {
        params.trees = hotdrink.parser.ViewParser.parse(params.eve);
      } catch (e) {
        raid.error(e);
      }
    }
  };

  /**
   * @name openDialog
   * @memberOf hotdrink
   * @description
   *   TODO
   * @public
   * @static
   * @function
   * @param {Object:OpenDialogParams} params
   *   TODO
   */
  var openDialog = function (params) {

    var modelController = makeModelController(params);
    if (!modelController) {
      /* Cannot proceed. */
      return;
    }

    maybeParseEve(params);
    if (!params.trees) {
      /* Cannot proceed. */
      return;
    }

    var factory = makeFactory();

    var element = factory.buildAndBind(params.trees, modelController);
    $("view").update(element);

    modelController.update();

  };

  /**
   * @name hotdrink
   * @namespace Top-level library namespace.
   */
  namespace.extend("hotdrink", {
    openDialog : openDialog,
    makeModelController : makeModelController
  });

}());

