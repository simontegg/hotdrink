var min = function (a, b) { return (a < b) ? (a) : (b); };
var max = function (a, b) { return (a < b) ? (b) : (a); };
var __enforced_max = function (value, min_value, max_value) {
  var t_max_value = max(min_value, max_value);
  /* Note: t_max_value used here so we don't have to repeat above expression. */
  var t_value = min(max(value, min_value), t_max_value);
  return [t_value, t_max_value];
};
var __enforced_min = function (value, min_value, max_value) {
  var t_min_value = min(min_value, max_value);
  /* Note: t_min_value used here so we don't have to repeat above expression. */
  var t_value = min(max(value, t_min_value), max_value);
  return [t_value, t_min_value];
};

(function () {

  var enforced_minmax = {
    getModel : function () {
      var model = hotdrink.makeModelFactory();

      model.addInterface("value", "50");
      model.addInterface("min", "0");
      model.addInterface("max", "100");

      model.addConstraint(
        model.addMethod(["value", "max"], function (model) {
          return __enforced_max(model.get("value"),model.get("min"),model.get("max"));
        }, ["value", "min", "max"]),
        model.addMethod(["value", "min"], function (model) {
          return __enforced_min(model.get("value"),model.get("min"),model.get("max"));
        }, ["value", "min", "max"])
      );

      model.addOutput("result", function (model) {
        return {value:model.get("value"),min:model.get("min"),max:model.get("max")};
      }, ["value", "min", "max"]);

      model.addInvariant("check_min", "model.get(\"min\")>=0", ["min"]);

      return model.close();
    }
  };

  namespace.open("hottest").enforced_minmax = enforced_minmax;

}());

