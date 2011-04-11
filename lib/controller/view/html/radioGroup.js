/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.radioGroup}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.radioGroup");

(function () {

  var common = hotdrink.controller.view.html.common;
  var valueB = hotdrink.controller.behavior.value;

  var onChange = function (view, listener) {
    common.addListener1(view.elts, ["change"], listener);
  };

  var RadioGroupController = Class.create(common.ViewController,
    common.groupIdentify, {
    bind : function (model, options) {
      if (typeof options.value === "string") {
        valueB.bindRead(this, onChange, common.read, model, options.value);
        valueB.bindWrite(model, options.value, common.write, this);
      }
    }
  });

  var compile = function (tree) {
    common.compileGroup("radio", tree);
  };

  var build = function (tree) {
    common.buildGroup("radio", tree);
  };

  namespace.extend("hotdrink.controller.view.html.radioGroup", {
    compile : compile,
    build : build,
    Controller : RadioGroupController
  });

}());

