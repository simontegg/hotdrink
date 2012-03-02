/**
 * @fileOverview <p>{@link hotdrink.bindings.html.command}</p>
 * @author John Freeman
 */

//provides("hotdrink.bindings.html.command");

(function () {

  var common = hotdrink.bindings.html.common;

  var bind = function bind(view, model, placeholder) {
    ASSERT(typeof placeholder === "function" && placeholder.command,
      "command widgets are bound only to commands in the model");
    var v = placeholder.command;
    $(view).bind("click", function () { model.get(v)(); });
  };

  namespace.open("hotdrink.bindings.html").bindCommand = bind;

}());

