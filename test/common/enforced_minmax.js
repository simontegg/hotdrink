min = function (a, b) { return (a < b) ? (a) : (b); };
max = function (a, b) { return (a < b) ? (b) : (a); };
__enforced_max = function (value, min_value, max_value) {
  var t_max_value = max(min_value, max_value);
  /* Note: t_max_value used here so we don't have to repeat above expression. */
  var t_value = min(max(value, min_value), t_max_value);
  return [t_value, t_max_value];
};
__enforced_min = function (value, min_value, max_value) {
  var t_min_value = min(min_value, max_value);
  /* Note: t_min_value used here so we don't have to repeat above expression. */
  var t_value = min(max(value, t_min_value), max_value);
  return [t_value, t_min_value];
};

(function () {

  var enforced_minmax = {
    cgraph : {
      variables : {
        value : {
          "cellType" : "interface",
          "usedBy" : ["__method_1","__method_2","__method_3"],
          "initializer" : "50"
        },
        min : {
          "cellType" : "interface",
          "usedBy" : ["__method_1","__method_2","__method_3","__method_4"],
          "initializer" : "0"
        },
        max : {
          "cellType" : "interface",
          "usedBy" : ["__method_1","__method_2","__method_3"],
          "initializer" : "100"
        },
        result : {
          "cellType" : "output",
          "usedBy" : []
        },
        check_min : {
          "cellType" : "invariant",
          "usedBy" : []
        }
      },
      methods : {
        __method_1 : {
          "inputs" : ["value","min","max"],
          "outputs" : ["value","max"]
        },
        __method_2 : {
          "inputs" : ["value","min","max"],
          "outputs" : ["value","min"]
        },
        __method_3 : {
          "inputs" : ["value","min","max"],
          "outputs" : ["result"]
        },
        __method_4 : {
          "inputs" : ["min"],
          "outputs" : ["check_min"]
        }
      },
      constraints : {
        __constraint_1 : { "methods" : ["__method_1","__method_2"] },
        __constraint_2 : { "methods" : ["__method_3"] },
        __constraint_3 : { "methods" : ["__method_4"] }
      }
    },
    methods : "{ __method_1 : function(E) {return (__enforced_max(E.last_eval1(\"value\"),E.eval1(\"min\"),E.last_eval1(\"max\")));}, __method_2 : function(E) {return (__enforced_min(E.last_eval1(\"value\"),E.last_eval1(\"min\"),E.eval1(\"max\")));}, __method_3 : function(E) {return ({value:E.eval1(\"value\"),min:E.eval1(\"min\"),max:E.eval1(\"max\")});}, __method_4 : function(E) {return (E.eval1(\"min\")>=0);} }"
  };

  namespace.open("hottest").enforced_minmax = enforced_minmax;

}());

