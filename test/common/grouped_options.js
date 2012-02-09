(function () {

  var grouped_options = {
    getModel : function () {
      var model = hotdrink.makeModelFactory();

      model.addInterface("all", "false");
      model.addInterface("a");
      model.addInterface("b");
      model.addInterface("c");

      model.addConstraint(
        model.addMethod("all", function (model) {
          return ((model.get("a")==model.get("b"))
                  &&(model.get("b")==model.get("c")))
            ? model.get("a") : false;
        }, ["a", "b", "c"]),
        model.addMethod(["a", "b", "c"], function (model) {
          return [model.get("all"),model.get("all"),model.get("all")];
        }, ["all"])
      );

      model.addOutput("result", function (model) {
        return {a : model.get("a"),b : model.get("b"),c : model.get("c")};
      }, ["a", "b", "c"]);

      return model.close();
    }
  };

  namespace.open("hottest").grouped_options = grouped_options;

}());

