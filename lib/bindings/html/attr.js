/**
 * @fileOverview <p>{@link hotdrink.bindings.html.attr}</p>
 * @author John Freeman
 */

//provides("hotdrink.bindings.html.attr");

(function () {

  var common = hotdrink.bindings.html.common;
  var valueB = hotdrink.bindings.behavior.value;

  var bind = function bind(view, model, attrBindings) {
    Object.keys(attrBindings).forEach(function (attrName) {
      var write = function write(view, value) {
        $(view).attr(attrName, value);
      };

      if (typeof attrBindings[attrName] === "function" ) {
        var v = attrBindings[attrName].target;
        valueB.bindWrite(model, v, write, view);
      } else {
        ASSERT(typeof attrBindings[attrName] === "string",
          "expected string value for attribute" + attrName);
        write(view, attrBindings[attrName]);
      }
    });
  };

  namespace.open("hotdrink.bindings.html").bindAttr = bind;

}());

