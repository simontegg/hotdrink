(function () {

  var cgraph = {
    variables : {
      file_name : {
        "cellType" : "interface",
        "usedBy" : ["__method_3","__method_4"],
        "initExpr" : "\"\""
      },
      file_type : {
        "cellType" : "interface",
        "usedBy" : ["__method_3"],
        "initExpr" : "\"bmp\""
      },
      compression_ratio : {
        "cellType" : "interface",
        "usedBy" : ["__method_2","__method_3"],
        "initExpr" : "100"
      },
      image_quality : {
        "cellType" : "interface",
        "usedBy" : ["__method_1"],
        "initExpr" : "100"
      },
      result : {
        "cellType" : "output",
        "usedBy" : []
      },
      check_name : {
        "cellType" : "invariant",
        "usedBy" : []
      }
    },
    methods : {
      __method_1 : {
        "inputs" : ["image_quality"],
        "outputs" : ["compression_ratio"]
      },
      __method_2 : {
        "inputs" : ["compression_ratio"],
        "outputs" : ["image_quality"]
      },
      __method_3 : {
        "inputs" : ["file_type","file_name","compression_ratio"],
        "outputs" : ["result"]
      },
      __method_4 : {
        "inputs" : ["file_name"],
        "outputs" : ["check_name"]
      }
    },
    constraints : {
      __constraint_1 : { "methods" : ["__method_1","__method_2"] },
      __constraint_2 : { "methods" : ["__method_3"] },
      __constraint_3 : { "methods" : ["__method_4"] }
    }
  };

  var methods = "{ __method_1 : function(E) {return (100-(4*(100-E.eval1(\"image_quality\"))));}, __method_2 : function(E) {return (100-((100-E.eval1(\"compression_ratio\"))/4));}, __method_3 : function(E) {return ((E.eval1(\"file_type\")==\"jpeg\") ? {type : E.eval1(\"file_type\"),name : E.eval1(\"file_name\"),ratio : E.eval1(\"compression_ratio\")} : {type : E.eval1(\"file_type\"),name : E.eval1(\"file_name\")});}, __method_4 : function(E) {return (E.eval1(\"file_name\")!=\"\");} }";

  var save_image = {
    getModel : function () {
      return hotdrink.makeModelController({
        cgraph : cgraph,
        methods : methods
      });
    }
  };

  namespace.open("hottest").save_image = save_image;

}());

