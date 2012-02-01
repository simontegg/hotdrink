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

  var methods = "{ __method_1 : function(model) {return (100-(4*(100-model.get(\"image_quality\"))));}, __method_2 : function(model) {return (100-((100-model.get(\"compression_ratio\"))/4));}, __method_3 : function(model) {return ((model.get(\"file_type\")==\"jpeg\") ? {type : model.get(\"file_type\"),name : model.get(\"file_name\"),ratio : model.get(\"compression_ratio\")} : {type : model.get(\"file_type\"),name : model.get(\"file_name\")});}, __method_4 : function(model) {return (model.get(\"file_name\")!=\"\");} }";

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

