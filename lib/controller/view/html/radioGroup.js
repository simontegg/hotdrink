/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.radioGroup}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.radioGroup");

(function () {

  var common = hotdrink.controller.view.html.common;
  var valueB = hotdrink.controller.behavior.value;

  var onChange = function (view, listener) {
    common.addListener(view.elts, ["change"], listener);
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
    var view = common.buildGroup("radio", tree);
    tree.view = new common.GroupController(view);
  };

  namespace.extend("hotdrink.controller.view.html.radioGroup", {
    compile : compile,
    build : build,
    Controller : RadioGroupController
  });

}());

