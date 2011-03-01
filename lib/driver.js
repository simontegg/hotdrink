/**
 * @fileOverview <p>{@link hotdrink}</p>
 * @author John Freeman
 */

//provides("hotdrink");

//requires("hotdrink.model");
//requires("hotdrink.controller.*");

(function () {

  /**
   * @name open_dialog
   * @memberOf hotdrink
   * @description
   *   Open a window with the given layout and bind its widgets to the model.
   *   NOTE: For the moment, the layout is opened in a pre-existing container
   *   with identifier "view".
   * @public
   * @static
   * @function
   * @param {String:Adam} sheet
   *   Model specification.
   * @param {String:HTML} layout
   *   View and binding specification. NOTE: This argument's type is subject to
   *   change.
   * @param {Object} [inputs={}]
   *   Initial values for input variables.
   */
  var open_dialog = function (sheet, layout, inputs) {
    /* View. */
    $("view").update(layout);

    /* Model and controller. */
    bind_dialog(sheet, inputs);
  };

  /**
   * @name bind_dialog
   * @memberOf hotdrink
   * @description
   *   Bind a set of pre-existing widgets to a model. Widgets are bound to
   *   variables whose names match their identifiers. This version is for
   *   Adam model specifications.
   * @public
   * @static
   * @function
   * @param {String:Adam} sheet
   *   Model specification.
   * @param {Object} [inputs={}]
   *   Initial values for input variables.
   * @see hotdrink.bind_dialog_parsed For pre-parsed model specifications.
   */
  var bind_dialog = function (sheet, inputs) {
    if (sheet === "") {
      return;
    }
    
    /* parse result object */
    var pr;
    
    try {
      pr = hotdrink.parser.ModelParser.parse(sheet);
    } catch (e) {
      raid.error(e);
      return;
    }
    try {
      bind_dialog_parsed(pr.cgraph, pr.methods, inputs);
    } catch (e) {
      raid.error("failed to use parse results :\n" + e);
    }

  };

  /**
   * @name bind_dialog_parsed
   * @memberOf hotdrink
   * @description
   *   Bind a set of pre-existing widgets to a model. Widgets are bound to
   *   variables whose names match their identifiers. This version is for
   *   pre-parsed model specifications.
   * @public
   * @static
   * @function
   * @param {Object:CGraphAst} cgraph
   *   Constraint graph. This object can be obtained by parsing an Adam
   *   specification. See {@link hotdrink.graph.CGraph}.
   * @param {String} methods
   *   A JSON string of an object with member methods that implement the methods
   *   of the model. This object can be obtained by parsing an Adam
   *   specification.
   * @param {Object} [inputs={}]
   *   Initial values for input variables.
   * @see hotdrink.bind_dialog For Adam model specifications.
   */
  var bind_dialog_parsed = function (cgraph, methods_txt, inputs) {
    /* Model. */
    /* TODO: Is there a better string representation for the methods? */
    var methods = eval("Object(" + methods_txt + ")");
    var model = new hotdrink.Model(cgraph, methods, inputs);

    /* Model controller. */
    var modelController = hotdrink.controller.makeModelController(model);

    /* View controllers. */
    var factory = new hotdrink.controller.Factory();
    hotdrink.controller.view.html.registerWidgetsForFind(factory);
    hotdrink.controller.view.html.registerWidgetsForValue(factory);
    hotdrink.controller.view.html.registerWidgetsForEnablement(factory);

    var tree = hotdrink.controller.view.html.findTree(model.variables);
    factory.findAndBind(tree, modelController);

    modelController.update();
  };

  /**
   * @name hotdrink
   * @namespace Top-level library namespace.
   */
  namespace.extend("hotdrink", {
    open_dialog : open_dialog,
    bind_dialog_parsed : bind_dialog_parsed,
    bind_dialog : bind_dialog
  });

}());

