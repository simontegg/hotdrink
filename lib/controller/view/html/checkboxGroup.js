/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.checkboxGroup}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.checkboxGroup");

(function () {

  var common = hotdrink.controller.view.html.common;

  var read = function (view) {
    ASSERT(Object.isArray(view.elts),
      "expected array of checkboxes");
    ASSERT(Object.isArray(view.values),
      "expected array of checkbox values");
    ASSERT(view.elts.length === view.values.length,
      "expected values to correspond with checkboxes");
    // Take the value for each checked element.
    var result = [];
    for (var i = 0; i < view.elts.length; ++i) {
      if (view.elts[i].checked)
        result.push(view.values[i]);
    }
    return { value : result };
  };

  var write = function (view, values) {
    // Check the elements for each value present.
    for (var i = 0; i < view.elts.length; ++i) {
      if (values.include(view.values[i])) {
        view.elts[i].checked = "checked";
      } else {
        view.elts[i].checked = undefined;
      }
    }
  };

  var CheckboxGroupController = common.buildGroupController(read, write);

  var build = function (tree) {
    /* br = build result */
    var br = common.buildGroup("checkbox", tree);
    tree.view = new CheckboxGroupController(br.elts, br.values);
  };

  namespace.extend("hotdrink.controller.view.html.checkboxGroup", {
    build : build,
    Controller : CheckboxGroupController
  });

}());

