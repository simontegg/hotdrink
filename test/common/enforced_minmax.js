var min = function (a, b) { return (a < b) ? (a) : (b); };
var max = function (a, b) { return (a < b) ? (b) : (a); };

(function () {

  var Model = function () {
    this.value = hd.variable(50);
    this.min = hd.variable(0);
    this.max = hd.variable(100);

    hd.constraint()
      .bind(["value", "max"], function () {
        var maxNext = max(this.min(), this.max());
        var valueNext = min(max(this.min(), this.value()), maxNext);
        return [valueNext, maxNext];
      })
      .bind(["value", "min"], function () {
        var minNext = min(this.min(), this.max());
        var valueNext = min(max(minNext, this.value()), this.max());
        return [valueNext, minNext];
      });

    this.result = hd.computed(function () {
      return { value : this.value(), min : this.min(), max : this.max() };
    });

    hd.invariant(function () { this.min() >= 0; });

  };

  var enforced_minmax = {
    getModel : function () {
      return hd.model(new Model());
    }
  };

  namespace.open("hottest").enforced_minmax = enforced_minmax;

}());

