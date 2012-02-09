/** * @fileOverview <p>{@link hotdrink}</p>
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
   *   Constructs a {@link hotdrink.controller.ModelController}.
   * @public
   * @static
   * @function
   * @param {Object:NamedParams} params
   *   <p>
   *   This function uses named parameters. That is, it accepts an object with
   *   the following members:
   *     <ul>
   *       <li>
   *       <p>
   *       inputs :: Object ({ name -> {@link concept.model.Value} })
   *       </p>
   *       <p>
   *       Initial values for input and interface variables.
   *       </p>
   *       </li>
   *
   *       <li>
   *       <p>
   *       adam :: String (Adam)<br />
   *       - or -<br />
   *       cgraph :: Object (basic cgraph)<br />
   *       methods :: String (JavaScript)
   *       </p>
   *       <p>
   *       The model specification. Either unparsed or parsed forms may be used,
   *       but not both.
   *       </p>
   *       </li>
   *     </ul>
   *   </p>
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

    Object.keys(params.cgraph.methods).forEach(function (m) {
      params.cgraph.methods[m].execute = methods[m];
    });

    /* TODO: To initialize, put initializers into methods, "solve" graph with
     * them, and run evaluator. */
    Object.keys(params.inputs).forEach(function (v) {
      var vv = params.cgraph.variables[v];
      ASSERT(vv.cellType === "input",
        "pass initializers only for input variables");
      vv.initExpr = Object.toJSON(params.inputs[v]);
    });

    var model = new hotdrink.Model(params.cgraph);
    var modelController = new hotdrink.controller.ModelController(model);

    return modelController;

  };

  var makeFactory = function () {
    var factory = new hotdrink.controller.Factory();
    factory.registerWidgets(hotdrink.controller.view.html.builders);
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
   *   Constructs a model and binds a user interface to it.
   * @public
   * @static
   * @function
   * @param {Object:NamedParams} params
   *   <p>
   *   This function uses named parameters. In addition to the named parameters
   *   of {@link hotdrink.makeModelController}, it accepts the following:
   *     <ul>
   *       <li>
   *       <p>
   *       eve :: String (Eve)<br />
   *       - or -<br />
   *       trees :: {@link concept.view.Ast}
   *       </p>
   *       <p>
   *       The view specification. Either unparsed or parsed forms may be used,
   *       but not both.
   *       </p>
   *       </li>
   *
   *       <li>
   *       <p>
   *       builders :: Object (BuilderRegistry)
   *       </p>
   *       <p>
   *       A registry of {@link concept.view.Builder}s to be passed to the
   *       {@link hotdrink.controller.Factory}. Use this option to extend
   *       HotDrink with support for more widgets.
   *       </p>
   *       <p>
   *       See {@link hotdrink.controller.Factory#registerWidgets}.
   *       </p>
   *       </li>
   *
   *       <li>
   *       <p>
   *       onCommand :: Function | String (URL) | Object ({ name -> Function })
   *       </p>
   *       <p>
   *       Specifies what to do when command is executed:
   *       </p>
   *       <ul>
   *         <li>A function will be called.</li>
   *         <li>A string will be treated as a URL for submitting a form.</li>
   *         <li>An object will be treated as a dictionary of functions.</li>
   *       </ul>
   *       <p>
   *       See {@link hotdrink.controller.ModelController#registerCommand}.
   *       </p>
   *       </li>
   *     </ul>
   *   </p>
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
    if (params.builders) {
      factory.registerWidgets(params.builders);
    }

    var element = factory.buildAndBind(params.trees, modelController);
    $("view").update(element);

    if (params.onCommand) {
      if (typeof params.onCommand === "object") {
        for (var cmdName in params.onCommand) {
          if (params.onCommand.hasOwnProperty(cmdName))
              modelController.registerCommand(cmdName, params.onCommand[cmdName]);
        }
      } else {
        modelController.registerCommand(params.onCommand);
      }
    }

    modelController.update();

    return modelController;
  };

  /* TODO: API for binding existing user interfaces to a model. */

  /**
   * @name hotdrink
   * @namespace Top-level library namespace.
   */
  namespace.extend("hotdrink", {
    openDialog : openDialog,
    makeModelController : makeModelController
  });

}());

