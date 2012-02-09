(function () {

  var hello_world = {
    getModel : function () {
      var model = hotdrink.makeModelFactory();

      model.addExpression("tmp", "\"Hello, World!\"");
      model.addOutput("result", "model.get(\"tmp\")", ["tmp"]);

      return model.close();
    }
  };

  namespace.open("hottest").hello_world = hello_world;

}());

