(function () {

  var Model = function () {
    this.tmp = hd.computed(function () { return "Hello, World!"; });
    this.result = hd.computed(function () { return this.tmp(); });
  };

  var hello_world = {
    getModel : function () {
      return hd.model(new Model());
    }
  };

  namespace.open("hottest").hello_world = hello_world;

}());

