/**
 * @fileOverview <p>{@link hotdrink.bindings.html.text}</p>
 * @author John Freeman
 */

//provides("hotdrink.bindings.html.text");

(function () {

  var common = hotdrink.bindings.html.common;

  namespace.extend("hotdrink.bindings.html", {
    bindText : common.bind,
    bindLabel : common.readOnlyBinder(
      function (view, value) { $(view).text(value); })
  });

}());

