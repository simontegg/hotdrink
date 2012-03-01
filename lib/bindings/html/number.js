/**
 * @fileOverview <p>{@link hotdrink.bindings.html.number}</p>
 * @author John Freeman
 */

//provides("hotdrink.bindings.html.number");

(function () {

  var common = hotdrink.bindings.html.common;

  var read = function (view) {
    return common.convertNumber($(view).val());
  };

  var bind = common.binder(
    common.write, common.onChange, read, common.enable, common.disable);

  namespace.open("hotdrink.bindings.html").bindNumber = bind;

}());

