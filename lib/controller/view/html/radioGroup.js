/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.radioGroup}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.radioGroup");

(function () {

  var common = hotdrink.controller.view.html.common;
  var valueB = hotdrink.controller.behavior.value;
  var enableB = hotdrink.controller.behavior.enablement;

  var onChange = function (view, listener) {
    common.groupAddListener(view.elts, ["click", "keyup"], listener);
  };

  var read = function (view) {
    // walk elements and values,
    // pulling the value for the checked element
    // return the chosen value
  };

  var write = function (view, value) {
    // walk elements, values, and chosen values,
    // checking the element for the chosen value
  };

  /* TODO: Along with CheckboxGroupController, factor into
   * common.buildGroupController that takes read and write functions. */
  var RadioGroupController = Class.create(common.ViewController,
    common.groupIdentify, {
    initialize : function ($super, elts, values) {
      $super(elts);
      this.values = values;
    },
    bind : function (model, options) {
      if (typeof options.value === "string") {
        var v = options.value;
        valueB.bindRead(this, onChange, read, model, v);
        valueB.bindWrite(model, v, write, this);
        enableB.bindEnablement(
          model, v, common.groupEnable, common.groupDisable, this);
      }
    }
  });

  var build = function (tree) {
    /* br = build result */
    var br = common.buildGroup("radio", tree);
    tree.view = new RadioGroupController(br.elts, br.values);
  };

  namespace.extend("hotdrink.controller.view.html.radioGroup", {
    build : build,
    Controller : RadioGroupController
  });

}());

