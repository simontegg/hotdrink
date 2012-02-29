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

  var ns = hotdrink.bindings.html;

  var inputBinders = {
    "checkbox" : function (view, model) {
      view = $(view);

      var name = view.attr("name");
      if (name) {
        view = $("input[name=" + name + "]", view.closest("form, body"));
      }

      if (view.length > 1) {
        /* Expect checkbox group. */
        ASSERT(false, "checkboxGroup not yet supported");
      } else {
        /* Expect single checkbox. */
        ns.bindCheckbox(view, model);
      }
    },
    "text" : ns.bindText
  };

  var addBinders = function addBinders(bindCtrlr) {
    bindCtrlr.addBinders({
      "input" : function (view, model) {
        view = $(view);
        var binder = inputBinders[$(view).attr("type")];
        if (binder) binder(view, model);
      },
      "span" : ns.bindLabel
    });
  };

  namespace.open("hotdrink.bindings.html").addBinders = addBinders;

}());

