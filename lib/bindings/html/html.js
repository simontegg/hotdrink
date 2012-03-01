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

  var addBinders = function addBinders(bindController) {
    bindController.addBinders({
      "checkbox" : ns.bindCheckbox,
      "label" : ns.bindLabel,
      "text" : ns.bindText
    });
  };

  ns.addBinders = addBinders;

}());

