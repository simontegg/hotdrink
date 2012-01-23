(function () {

  var cgraph = {
    variables : {
      tmp : {
        "cellType" : "logic",
        "usedBy" : ["__method_2"]
      },
      result : {
        "cellType" : "output",
        "usedBy" : []
      }
    },
    methods : {
      __method_1 : {
        "inputs" : [],
        "outputs" : ["tmp"]
      },
      __method_2 : {
        "inputs" : ["tmp"],
        "outputs" : ["result"]
      }
    },
    constraints : {
      __constraint_1 : { "methods" : ["__method_1"] },
      __constraint_2 : { "methods" : ["__method_2"] }
    }
  };

  var methods = "{ __method_1 : function(E) {return (\"Hello, World!\");}, __method_2 : function(E) {return (E.eval1(\"tmp\"));} }";

  var hello_world = {
    getModel : function () {
      return hotdrink.makeModelController({
        cgraph : cgraph,
        methods : methods
      });
    }
  };

  namespace.open("hottest").hello_world = hello_world;

}());

