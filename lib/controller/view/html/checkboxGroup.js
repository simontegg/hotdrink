/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.checkboxGroup}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.checkboxGroup");

(function () {

  var common = hotdrink.controller.view.html.common;
  var valueB = hotdrink.controller.behavior.value;

  var onChange = function (view, listener) {
    common.addListener(view.elts, ["click", "keyup"], listener);
  };

  var CheckboxGroupController = Class.create(common.ViewController,
    common.groupIdentify, {
    bind : function (model, options) {
      if (typeof options.value === "string") {
        valueB.bindRead(this, onChange, common.read, model, options.value);
        valueB.bindWrite(model, options.value, common.write, this);
      }
    }
  });

  var compile = function (tree) {
    common.compileGroup("checkbox", tree);
  };

  var build = function (tree) {
    var elts = common.buildGroup("checkbox", tree);
    tree.view = new CheckboxGroupController(elts);
  };

  namespace.extend("hotdrink.controller.view.html.checkboxGroup", {
    compile : compile,
    build : build,
    Controller : CheckboxGroupController
  });

}());

