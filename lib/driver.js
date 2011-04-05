/**
 * @fileOverview <p>{@link hotdrink}</p>
 * @author John Freeman
 */

//provides("hotdrink");

//requires("hotdrink.model");
//requires("hotdrink.controller.*");

(function () {

  var makeModelController = function (params) {

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
        return null;
      }
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
    hotdrink.controller.view.html.registerWidgetsForFind(factory);
    hotdrink.controller.view.html.registerWidgetsForValue(factory);
    hotdrink.controller.view.html.registerWidgetsForEnablement(factory);
    return factory;
  };

  var maybeParseEve = function (params) {
    if (typeof params.eve === "string") {
      ASSERT(!("view" in params),
       "do not pass both parsed and unparsed view specifications");
      /* TODO: Parse Eve. */
    }
    return params;
  };

  /**
   * @name bindDialog
   * @memberOf hotdrink
   * @description
   *   TODO
   * @public
   * @static
   * @function
   * @param {Object:BindDialogParams} params
   *   TODO
   */
  var bindDialog = function (params) {

    var modelController = makeModelController(params);
    var factory = makeFactory();
    maybeParseEve(params);

    if (typeof params.view !== "object") {
      params.view = hotdrink.controller.view.html.findTree(
                      modelController.model.variables);
    }

    factory.findAndBind(params.view, modelController);
    modelController.update();

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

    if (typeof params.html === "string") {
      $("view").update(params.html);
      bindDialog(params);
      return;
    }

    var modelController = makeModelController(params);
    var factory = makeFactory();
    maybeParseEve(params);

    factory.buildAndBind(params.view, modelController);
    modelController.update();

  };

  /**
   * @name hotdrink
   * @namespace Top-level library namespace.
   */
  namespace.extend("hotdrink", {
    openDialog : openDialog,
    bindDialog : bindDialog
  });

}());

