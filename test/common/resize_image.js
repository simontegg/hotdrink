var resize_image = {
  cgraph : {
    variables : {
      initial_height : {
        "cellType" : "input",
        "usedBy" : ["__method_1","__method_5","__method_6"],
        "initializer" : "5*300"
      },
      initial_width : {"cellType":"input","usedBy":["__method_2","__method_3","__method_4"],"initializer":"7*300"},
      absolute_height : {"cellType":"interface","usedBy":["__method_6","__method_9"],"initializer":"values.get(\"initial_height\")"},
      absolute_width : {"cellType":"interface","usedBy":["__method_4","__method_9"]},
      relative_height : {"cellType":"interface","usedBy":["__method_5","__method_7","__method_8"]},
      relative_width : {"cellType":"interface","usedBy":["__method_3","__method_7","__method_8"]},
      preserve_ratio : {"cellType":"interface","usedBy":["__method_7","__method_8"],"initializer":"true"},
      string_1 : {"cellType":"logic","usedBy":[]},
      string_2 : {"cellType":"logic","usedBy":[]},
      result : {"cellType":"output","usedBy":[]}
    },
    methods : {
      __method_1 : {"inputs":["initial_height"],"outputs":["string_1"]},
      __method_2 : {"inputs":["initial_width"],"outputs":["string_2"]},
      __method_3 : {"inputs":["relative_width","initial_width"],"outputs":["absolute_width"]},
      __method_4 : {"inputs":["absolute_width","initial_width"],"outputs":["relative_width"]},
      __method_5 : {"inputs":["relative_height","initial_height"],"outputs":["absolute_height"]},
      __method_6 : {"inputs":["absolute_height","initial_height"],"outputs":["relative_height"]},
      __method_7 : {"inputs":["preserve_ratio","relative_height","relative_width"],"outputs":["relative_width"]},
      __method_8 : {"inputs":["preserve_ratio","relative_width","relative_height"],"outputs":["relative_height"]},
      __method_9 : {"inputs":["absolute_height","absolute_width"],"outputs":["result"]}
    },
    constraints : {
      __constraint_1 : {"methods":["__method_1"]},
      __constraint_2 : {"methods":["__method_2"]},
      __constraint_3 : {"methods":["__method_3","__method_4"]},
      __constraint_4 : {"methods":["__method_5","__method_6"]},
      __constraint_5 : {"methods":["__method_7","__method_8"]},
      __constraint_6 : {"methods":["__method_9"]}
    }
  },
  methods: "{ __method_1 : function(E) {return (\"Initial Height : \"+E.eval1(\"initial_height\"));}, __method_2 : function(E) {return (\"Initial Width : \"+E.eval1(\"initial_width\"));}, __method_3 : function(E) {return ((E.eval1(\"relative_width\")*E.eval1(\"initial_width\"))/100);}, __method_4 : function(E) {return ((E.eval1(\"absolute_width\")*100)/E.eval1(\"initial_width\"));}, __method_5 : function(E) {return ((E.eval1(\"relative_height\")*E.eval1(\"initial_height\"))/100);}, __method_6 : function(E) {return ((E.eval1(\"absolute_height\")*100)/E.eval1(\"initial_height\"));}, __method_7 : function(E) {return (E.eval1(\"preserve_ratio\") ? E.eval1(\"relative_height\") : E.last_eval1(\"relative_width\"));}, __method_8 : function(E) {return (E.eval1(\"preserve_ratio\") ? E.eval1(\"relative_width\") : E.last_eval1(\"relative_height\"));}, __method_9 : function(E) {return ({height:E.eval1(\"absolute_height\"),width:E.eval1(\"absolute_width\")});} }"
};

