(function () {

  var hello_world = {
    cgraph : {
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
    },
    methods : "{ __method_1 : function(E) {return (\"Hello, World!\");}, __method_2 : function(E) {return (E.eval1(\"tmp\"));} }"
  };

  namespace.open("hottest").hello_world = hello_world;

}());

