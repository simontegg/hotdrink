/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.radioGroup}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.radioGroup");

(function () {

  var common = hotdrink.controller.view.html.common;

  var read = function (view) {
    ASSERT(Object.isArray(view.elts),
      "expected array of radio buttons");
    // Take the value for the checked element.
    for (var i = 0; i < view.elts.length; ++i) {
      if (view.elts[i].checked)
        return { value : view.values[i] };
    }
    // In case no button is checked,
    return { value : null };
  };

  var write = function (view, value) {
    // TODO: Uncheck the other radio buttons? Appears to be unnecessary.
    var i = view.values.indexOf(value);
    if (i >= 0) {
      view.elts[i].checked = "checked";
    } else {
      // Value cannot be displayed.
    }
  };

  var RadioGroupController = common.buildGroupController(read, write);

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

