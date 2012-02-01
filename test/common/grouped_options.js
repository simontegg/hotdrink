(function () {

  var cgraph = {
    variables : {
      all : {
        "cellType" : "interface",
        "usedBy" : ["__method_2"],
        "initExpr" : "false"
      },
      a : {
        "cellType" : "interface",
        "usedBy" : ["__method_1","__method_3"]
      },
      b : {
        "cellType" : "interface",
        "usedBy" : ["__method_1","__method_3"]
      },
      c : {
        "cellType" : "interface",
        "usedBy" : ["__method_1","__method_3"]
      },
      result : {
        "cellType" : "output",
        "usedBy" : []
      }
    },
    methods : {
      __method_1 : {
        "inputs" : ["a","b","c"],
        "outputs" : ["all"]
      },
      __method_2 : {
        "inputs" : ["all"],
        "outputs" : ["a","b","c"]
      },
      __method_3 : {
        "inputs" : ["a","b","c"],
        "outputs" : ["result"]
      }
    },
    constraints : {
      __constraint_1 : { "methods" : ["__method_1","__method_2"] },
      __constraint_2 : { "methods" : ["__method_3"] }
    }
  };

  var methods = "{ __method_1 : function(model) {return (((model.get(\"a\")==model.get(\"b\"))&&(model.get(\"b\")==model.get(\"c\"))) ? model.get(\"a\") : false);}, __method_2 : function(model) {return ([model.get(\"all\"),model.get(\"all\"),model.get(\"all\")]);}, __method_3 : function(model) {return ({a : model.get(\"a\"),b : model.get(\"b\"),c : model.get(\"c\")});} }";

  var grouped_options = {
    getModel : function () {
      return hotdrink.makeModelController({
        cgraph : cgraph,
        methods : methods
      });
    }
  };

  namespace.open("hottest").grouped_options = grouped_options;

}());

