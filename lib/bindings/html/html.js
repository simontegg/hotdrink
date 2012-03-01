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

  var extend = function extend(binders) {
    Object.extend(binders, {
      "checkbox" : ns.bindCheckbox,
      "checkboxGroup" : ns.bindCheckboxGroup,
      "radioGroup" : ns.bindRadioGroup,
      "selectOne" : ns.bindSelectOne,
      "selectMany" : ns.bindSelectMany,
      "text" : ns.bindText,
      "label" : ns.bindLabel,
      "number" : ns.bindNumber,
      "attr" : ns.bindAttr
    });
  };

  ns.extend = extend;

}());

