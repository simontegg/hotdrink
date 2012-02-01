(function () {

  var cgraph = {
    variables : {
      initial_height : {
        "cellType" : "input",
        "usedBy" : ["__method_5","__method_6"],
        "initExpr" : "5*300"
      },
      initial_width : {
        "cellType" : "input",
        "usedBy" : ["__method_3","__method_4"],
        "initExpr" : "7*300"
      },
      absolute_height : {
        "cellType" : "interface",
        "usedBy" : ["__method_6","__method_9"],
        "initExpr" : "model.get(\"initial_height\")"
      },
      absolute_width : {
        "cellType" : "interface",
        "usedBy" : ["__method_4","__method_9"]
      },
      relative_height : {
        "cellType" : "interface",
        "usedBy" : ["__method_5","__method_7","__method_8"]
      },
      relative_width : {
        "cellType" : "interface",
        "usedBy" : ["__method_3","__method_7","__method_8"]
      },
      preserve_ratio : {
        "cellType" : "interface",
        "usedBy" : ["__method_7","__method_8"],
        "initExpr" : "true"
      },
      result : {
        "cellType" : "output",
        "usedBy" : []
      }
    },
    methods : {
      __method_3 : {
        "inputs" : ["relative_width","initial_width"],
        "outputs" : ["absolute_width"]
      },
      __method_4 : {
        "inputs" : ["absolute_width","initial_width"],
        "outputs" : ["relative_width"]
      },
      __method_5 : {
        "inputs" : ["relative_height","initial_height"],
        "outputs" : ["absolute_height"]
      },
      __method_6 : {
        "inputs" : ["absolute_height","initial_height"],
        "outputs" : ["relative_height"]
      },
      __method_7 : {
        "inputs" : ["preserve_ratio","relative_height","relative_width"],
        "outputs" : ["relative_width"]
      },
      __method_8 : {
        "inputs" : ["preserve_ratio","relative_width","relative_height"],
        "outputs" : ["relative_height"]
      },
      __method_9 : {
        "inputs" : ["absolute_height","absolute_width"],
        "outputs" : ["result"]
      }
    },
    constraints : {
      __constraint_3 : { "methods" : ["__method_3","__method_4"] },
      __constraint_4 : { "methods" : ["__method_5","__method_6"] },
      __constraint_5 : { "methods" : ["__method_7","__method_8"] },
      __constraint_6 : { "methods" : ["__method_9"] }
    }
  };

  var methods = "{ __method_3 : function(E) {return ((E.eval1(\"relative_width\")*E.eval1(\"initial_width\"))/100);}, __method_4 : function(E) {return ((E.eval1(\"absolute_width\")*100)/E.eval1(\"initial_width\"));}, __method_5 : function(E) {return ((E.eval1(\"relative_height\")*E.eval1(\"initial_height\"))/100);}, __method_6 : function(E) {return ((E.eval1(\"absolute_height\")*100)/E.eval1(\"initial_height\"));}, __method_7 : function(E) {return (E.eval1(\"preserve_ratio\") ? E.eval1(\"relative_height\") : E.last_eval1(\"relative_width\"));}, __method_8 : function(E) {return (E.eval1(\"preserve_ratio\") ? E.eval1(\"relative_width\") : E.last_eval1(\"relative_height\"));}, __method_9 : function(E) {return ({height : E.eval1(\"absolute_height\"),width : E.eval1(\"absolute_width\")});} }";

  var resize_image = {
    getModel : function () {
      return hotdrink.makeModelController({
        cgraph : cgraph,
        methods : methods
      });
    }
  };

  namespace.open("hottest").resize_image = resize_image;

}());

