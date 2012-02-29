/**
 * @fileOverview <p>{@link hotdrink.bindings.html}</p>
 * @author John Freeman
 */

/**
 * @name hotdrink.bindings.html
 * @namespace
 *   <p>
 *   Namespace for the standard HTML widget binders.
 *   </p>
 *
 *   <p>
 *   Currently includes support for the following widget types:
 *     <ul>
 *       <li>checkbox</li>
 *       <li>checkboxGroup</li>
 *       <li>commandButton</li>
 *       <li>dropdown</li>
 *       <li>number</li>
 *       <li>radioGroup</li>
 *       <li>selectMany</li>
 *       <li>selectOne</li>
 *       <li>text</li>
 *     </ul>
 *   </p>
 */

(function () {

  var inputBinders = {
    "checkbox" : function (view, model) {
      view = $(view);
      var name = view.attr("name");
      if (name) {
        /* Expect checkbox group. */
        view = $("input[name=" + name + "]", view.parent());
      } else {
        /* Expect single checkbox. */
        hotdrink.bindings.html.bindCheckbox(view, model);
      }
    }
  };

  var addBinders = function addBinders(bindCtrlr) {
    bindCtrlr.addBinders({
      "input" : function (view, model) {
        view = $(view);
        var binder = inputBinders[$(view).attr("type")];
        if (binder) binder(view, model);
      }
    });
  };

  namespace.open("hotdrink.bindings.html").addBinders = addBinders;

}());

