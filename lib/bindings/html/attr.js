/**
 * @fileOverview <p>{@link hotdrink.bindings.html.attr}</p>
 * @author John Freeman
 */

//provides("hotdrink.bindings.html.attr");

(function () {

  var common = hotdrink.bindings.html.common;
  var valueB = hotdrink.bindings.behavior.value;

  var bind = function bind(view, model, options) {
    Object.keys(options).forEach(function (attrName) {
      var write = function write(view, value) {
        $(view).attr(attrName, value);
      };

      var v = options[attrName].target;
      valueB.bindWrite(model, v, write, view);
    });
  };

  namespace.open("hotdrink.bindings.html").bindAttr = bind;

}());

