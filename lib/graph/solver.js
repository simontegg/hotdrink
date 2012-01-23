/**
 * @fileOverview Constraint Solver <p>{@link hotdrink.graph.Solver}</p>
 * @author Wonseok Kim
 */

//provides("hotdrink.graph.Solver");

(function () {
  /* Utility functions */

  /**
   * Data structure Set implementation.
   */
  var HashSet = Class.create({
    initialize : function () {
      this._map = new Hash();
    },
    add : function (value){
      this._map.set(value, value);
    },
    remove : function (value) {
      this._map.unset(value);
    },
    toArray : function () {
      return this._map.values();
    }
  });
  
  function findMinIndex(array, evaluator) {
    if(!array || array.length==0) {
      return -1;
    }
    
    //if(!evaluator) evaluator = function(x) {return x;}
    evaluator = evaluator || identity;
    
    var min_index = 0;
    var min_value = evaluator(array[0]);
    for(var i=1; i<array.length; i++) {
      var value = evaluator(array[i]);
      if (value < min_value) {
        min_value = value;
        min_index = i;
      }
    }
    
    return min_index;
  }

  function findMaxIndex(array, evaluator) {
    if(!array || array.length==0) {
      return -1;
    }
    
    //if(!evaluator) evaluator = function(x) {return x;}
    evaluator = evaluator || identity;
    
    var max_index = 0;
    var max_value = evaluator(array[0]);
    for(var i=1; i<array.length; i++) {
      var value = evaluator(array[i]);
      if (value > max_value) {
        max_value = value;
        max_index = i;
      }
    }
    
    return max_index;
  }

  function findMax(array, evaluator) {
    var i = findMaxIndex(array, evaluator);
    if (i==-1) return null;
    
    return array[i];
  }

  function extractMin(array, evaluator) {
    var i = findMinIndex(array, evaluator);
    if (i==-1) return null;
    
    var element = array[i];
    array.splice(i,1);
    
    return element;
  }

  function extractMax(array, evaluator) {
    var i = findMaxIndex(array, evaluator);
    if (i==-1) return null;
    
    var element = array[i];
    array.splice(i,1);
    
    return element;
  }

  /**
   * Sort vertices topologically on a directed acyclic graph.
   * 
   * @param {Hash} graph which is a Hash object with key being a node 
   *              and value is being the list of adjacent nodes.
   * @returns {Array} the sorted list of vertices.
   */
  function tpSortGraph(graph) {
    var incomingEdges = new Hash();
    
    /* construct incoming edges by looking at outgoing edges */
    graph.each(function (pair) {
      var node = pair.key;
      var adjacentList = pair.value;
      
      if (incomingEdges.get(node) == null) {
        incomingEdges.set(node, new Array());
      }

      adjacentList.each(function (adjacent_node) {
        if (incomingEdges.get(adjacent_node) == null) {
          incomingEdges.set(adjacent_node, new Array());
        }
        incomingEdges.get(adjacent_node).push(node);
      });
    });
    
    /* topological sort algorithm on the graph */
    var sorted = [];
    var queue = []; /* vertices w/ no incoming edges */
    incomingEdges.each(function (pair) {
      var node = pair.key;
      var incomingList = pair.value;
      if (incomingList.size() == 0) {
          queue.push(node);
      }
    });
    
    while (queue.size() != 0) {
      var node = queue.shift();
      sorted.push(node);
      /* for each node m with an edge e (n,m)
       * remove e and check if m has no other incoming edges */
      graph.get(node).each(function (out_node) {
        var incomingList = incomingEdges.get(out_node);
        incomingList.remove(node);

        if (incomingList.size() == 0) {
          queue.push(out_node);
        }
      });
    }
    /* TODO: if graph still has edges then output error message */
    
    return sorted;
  }
  /* End of Utility functions */

  /**
   * The rule of comparing strengths of Constraints.
   * The strongest strength value is 0 and the weaker strength has less value.
   */
  var Strength = {
    REQUIRED : 0,      /* required(strongest) strength */
    WEAKEST  : 999999, /* weakest strength */
    
    /* compare two strengths and return -1, 0, and 1 for <,=,> */
    compare : function (strength1, strength2) {
      if (strength1 > strength2) {
        return -1;
      }
      else if (strength1 == strength2) {
        return 0;
      }
      else {
        return 1;
      }
    },
    min : function (strength1, strength2) {
      return this.compare(strength1, strength2) < 0 ? strength1 : strength2;
    },
    max : function (strength1, strength2) {
      return this.compare(strength1, strength2) > 0 ? strength1 : strength2;
    }
  };
  
  /* constants for mark */
  var NULL_MARK = 0;
  var POTENTIALLY_UNDETERMINED_MARK = 1;
  
  var VISITED_MARK_LOW_BOUND = 1000;
  var VISITED_MARK_UPPER_BOUND = 1999;
  var SEARCH_MARK_LOW_BOUND = 2000;
  var SEARCH_MARK_UPPER_BOUND = 2999;
  
  var Variable = Class.create({
    initialize : function (id) {
      this.id = id;            /* String */
      this.constraints = [];   /* Array<Constraints> */
      this.num_constraints = 0;
      this.mark = -1;
      this.determined_by = null; /* Constraint */
    },
    toString : function () {
      return this.id;
    }
  });
  
  var Method = Class.create({
    initialize : function (id) {
      this.id = id;       /* String */
      this.inputs = [];   /* Array<Variable> */
      this.outputs = [];  /* Array<Variable> */
    },
    toString : function () {
      return this.id;
    }
  });
  
  var Constraint = Class.create({
    initialize : function (id, strength, variables, methods) {
      this.id = id; /* String */
      this.variables = variables;  /* Array<Variable> */
      this.methods = methods;      /* Array<Method> */
      this.strength = strength;
      
      this.selected_method = null; /* Method */
      this.mark = -1;
    },
    isRequired : function () {
      return this.strength == Strength.REQUIRED;
    },
    isSatisfied : function () {
      return this.selected_method != null;
    },
    getVariables : function () {
      return this.variables;
    },
    getMethods : function () {
      return this.methods;
    },
    toString : function () {
      return this.id;
    }
  });
  
  /* internal graph used by solver */
  var IGraph = Class.create({
    initialize : function (/*CGraph*/ cgraph) {
      this.cgraph = cgraph;
  
      /* populate with cgraph */
      var _variables = new Hash();   /* id:Variable */
      var _methods = new Hash();     /* id:Method */
      var _constraints = new Hash(); /* id:Constraint */

      cgraph.variables.keys().each(function (id){
        _variables.set(id, new Variable(id));
      });
      cgraph.methods.each(function (pair){
        var mtId = pair.key;
        var mtObj = pair.value;
        
        var mt = new Method(mtId);

        mtObj.inputs.each(function (v_id){
          mt.inputs.push(_variables.get(v_id));
        });
        mtObj.outputs.each(function (v_id){
          mt.outputs.push(_variables.get(v_id));
        });
        _methods.set(mtId, mt);
      });
      cgraph.constraints.each(function (pair){
        var cnId = pair.key;
        var method_ids = pair.value.methods;
        
        var methods = [];

        /* collect variables from each method */
        var varset = new HashSet();
        method_ids.each(function (m_id){
          var mt = _methods.get(m_id);
          methods.push(mt);
          
          mt.inputs.each(function (v){
            varset.add(v);
          });
          mt.outputs.each(function (v){
            varset.add(v);
          });
        });
        var variables = varset.toArray();
        
        var cn = new Constraint(cnId, Strength.REQUIRED, variables, methods);

        _constraints.set(cnId, cn);
      });

      this.variables = _variables;
      this.methods = _methods;
      this.constraints = _constraints;
    },
    getVariable : function (varId) {
      return this.variables.get(varId);
    },
    getVariables : function () {
      return this.variables.values();
    },
    getMethod : function (methodId) {
      return this.methods.get(methodId);
    },
    getConstraint : function (cnId) {
      return this.constraints.get(cnId);
    },
    getConstraints : function () {
      return this.constraints.values();
    },
    addStayConstraint : function (varId, strength) {
      /* add new constant method for the variable */
      var mtId = varId + "_const";
      var mt = new Method(mtId);
      var v = this.variables.get(varId);
      mt.outputs.push(v);
      this.methods.set(mtId, mt);
      
      /* add new stay constraint */
      var cnId = varId + "_stay";
      var cn = new Constraint(cnId, strength, [v], [mt]);
      this.constraints.set(cnId, cn);

      return cn;
    },
    getStayConstraint : function (varId) {
      var cnId = varId + "_stay";
      return this.constraints.get(cnId);
    },
    removeConstraint : function (cn) {
      var self = this;
      cn.methods.each(function(mt){
        self.methods.unset(mt.id);
      });
      this.constraints.unset(cn.id);
    },
    getSatisfiedConstraints : function () {
      var result = [];
      this.getConstraints().each(function(cn){
        if(cn.isSatisfied())
          result.push(cn);
      });
      return result;
    },
    /* returns selected methods from satisfied required constraints */
    getSelectedMethods : function () {
      var result = [];
      this.getConstraints().each(function(cn){
        if(cn.isRequired() && cn.isSatisfied())
          result.push(cn.selected_method);
      });
      return result;
    }
  });

  /**
   * Removes the constraint of the strongest strength.
   * @param {Constraint[]} cnsQueue
   * @returns {Constraint} the removed element.
   */
  var deleteMax = function (cnsQueue) {
    var cn = extractMin(cnsQueue, function(c) {
      return c.strength;
    });
    return cn;
  };
  
  /**
   * Removes the constraint of the weakest strength.
   * @param {Constraint[]} cnsQueue
   * @returns {Constraint} the removed element.
   */
  var deleteMin = function (cnsQueue) {
    var cn = extractMax(cnsQueue, function(c) {
      return c.strength;
    });
    return cn;
  };


  /**
   * Find the minimal output method which has only free output variables.
   * 
   * @param {Constraint} cn
   * @returns {Method} the found method.
   */
  var findMinOutputMethodHasOnlyFreeOutputVars = function (cn) {
    if (cn == null) return null;

    var selectedMethod = null;
    var minOutput = Number.MAX_VALUE;

    var methods = cn.getMethods();
    for (var j = 0; j < methods.length; j++) {
      var mt = methods[j];

      /* skip if mt has already the number of outputs 
       * greater than candidate */
      if (mt.outputs.length >= minOutput) continue;

      /* mt is a candidate, 
       * if v.num_constraints == 1 for all v in mt.outputs */
      var candidate = true;
      for (var k = 0; k < mt.outputs.length; k++) {
        var v = mt.outputs[k];
        if (v.num_constraints != 1) {
          candidate = false;
          break;
        }
      }

      if (candidate) {
        selectedMethod = mt;
        minOutput = mt.outputs.length;
      }
    }

    return selectedMethod;
  };
  

  /**
   * Topological sort selected methods.
   * @param {Method[]} selectedMethods
   * @returns {String[]} sorted method ids.
   */
  var sortMethods = function (selectedMethods) {
    /* generate graph representing relationships among selected methods */
    var mgraph = new Hash();
    selectedMethods.each(function (mt) {
      mgraph.set(mt.id, new Array());
    });
    selectedMethods.each(function (mt1) {
      mt1.inputs.each(function (v) {
        if (v.determined_by != null) {
          var mt2 = v.determined_by.selected_method;
          /* mt2 -> v -> mt1 */
          if (mgraph.get(mt2.id) != null) {
            mgraph.get(mt2.id).push(mt1.id);
          }
        }
      });
    });

    /* sort the graph of selected methods */
    var sortedMethods = tpSortGraph(mgraph);
    return sortedMethods;
  };

  /* compute the difference of priority */
  var computePriorityDiff = function (oldPriority, newPriority) {
    var oldPtr = oldPriority.length - 1;
    var newPtr = newPriority.length - 1;

    while (oldPtr >= 0) {
      if (oldPriority[oldPtr] == newPriority[newPtr]) {
        oldPtr--;
        newPtr--;
      }
      else {
        oldPtr--;
      }
    }

    return newPriority.slice(0, newPtr + 1);
  };

  /* Incremental QuickPlan algorithm */
  
  /**
   * @param {hotdrink.graph.CGraph} cgraph
   */
  var initialize = function (cgraph) {
    this.cgraph = cgraph;
    
    this.unenforcedCnsQueue = [];
    this.retractableCnsQueue = [];
    this.undoStack = [];
    this.cnToEnforce = null;
    this.freeVariableSet = [];
    this.potentialUndeterminedVars = [];
    this.strongestRetractedStrength = Strength.WEAKEST;
    this.visitedMark = VISITED_MARK_LOW_BOUND;
    this.searchMark = SEARCH_MARK_LOW_BOUND;
    
    this.prevPriority = [];
    this.initialized = false;
    
    /* construct internal intermediate graph from cgraph */
    this.graph = new IGraph(cgraph);

    initializeSolution(this);
  };
  
  /**
   * Initialize intermediate graph 
   * and find solution for required constraints.
   */
  var initializeSolution = function (self) {
    LOG("Solving required constraints...");

    var graph = self.graph;
    
    /* for each v in constraint.variables, v.constraints += constraint */
    graph.getConstraints().each(function (cn){
      cn.variables.each(function (v) {
        v.constraints.push(cn);
      });
    });
    /* solve only with required constraints */
    /* if not satisfiable, this will throw an Error */
    multiOutputPlannerForRequiredConstraints(self);
    
    /* add stay constraints */
    graph.getVariables().each(function (v) {
      var stayCn = graph.addStayConstraint(v.id, Number.MAX_VALUE-1);
      v.constraints.push(stayCn);
    });
    
    self.initialized = true;

    var selectedMethods = graph.getSelectedMethods();
    LOG("selected methods = [" + selectedMethods.toString() + "]");
  };

  /**
   * Solve the given constraint graph with variables priority.
   * 
   * @param {String[]} priority  variable names in decreasing order of strength.
   * @param {boolean}  [sort]  (default is false) if true the result will be sorted topologically.
   * @returns {String[]} selected methods
   */
  var solve = function (priority, sort) {
    var self = this;

    if (!self.initialized) {
      throw new Error("solver is not initialized properly");
    }

    sort = sort || false;

    LOG("prev priority = [" + self.prevPriority.toString() + "]");
    LOG("new  priority = [" + priority.toString() + "]");

    var graph = self.graph;

    /* TODO Optimize: don't need to add stay constraints 
     * for input and output variables */

    /* Assumes that priority has the same set of variables */

    var changeset = computePriorityDiff(this.prevPriority, priority);
    LOG("changeset = [" + changeset.toString() + "]");

    if (changeset.length > 0) {
      /* assign new relative strengths */
      for (var i = 0; i < priority.length; i++) {
        var strength = i + 1;
        var stayCn = graph.getStayConstraint(priority[i]);
        if (stayCn == null) {
          throw new Error("the variable " + priority[i] + " does not belong to cgraph");
        }
        stayCn.strength = strength;
      }

      applyChangeset(self, changeset);
    }

    self.prevPriority = priority.clone();

    var selectedMethods = graph.getSelectedMethods();
    LOG("selected methods = [" + selectedMethods.toString() + "]");

    /* topological sort selected methods according to the data flow */
    if (sort) {
      selectedMethods = sortMethods(selectedMethods);
      LOG("sorted methods = [" + selectedMethods.toString() + "]");
    }

    /* convert Method[] -> String[] */
    var plan = [];
    selectedMethods.each(function (m) {
      plan.push(m.id);
    });

    return plan;
  };

  var applyChangeset = function (self, changeset) {
    if (changeset.length == 0) return;

    LOG("Applying the changeset...");

    var graph = self.graph;

    /* try to enforce the stay constraints for vars in changeset */
    for (var i = 0; i < changeset.length; i++) {
      var cn = graph.getStayConstraint(changeset[i]);
      self.unenforcedCnsQueue.push(cn);
    }

    constraintHierarchySolver(self);
  };
  
  var constraintHierarchySolver = function(self) {
    LOG("constraint_hierarchy_solver()");

    while (self.unenforcedCnsQueue.size() > 0) {
      /* fetch the strongest unsatisfied constraint */
      var cnToEnforce = deleteMax(self.unenforcedCnsQueue);
      self.cnToEnforce = cnToEnforce;
      LOG("cn_to_enforce := " + cnToEnforce.id + " (strength=" + cnToEnforce.strength + ")");

      /* generate unique mark values for visited_mark and search_mark */
      increaseMarks(self);
      LOG("visited_mark = " + self.visitedMark + ", search_mark = " + self.searchMark);

      self.strongestRetractedStrength = Strength.WEAKEST;
      self.potentialUndeterminedVars.clear();
      self.retractableCnsQueue.clear();
      self.undoStack.clear();

      collectUpstreamConstraints(self, cnToEnforce);

      /*
       * cull from the free variable set variables that belong to more
       * than one constraint
       */
      self.freeVariableSet = self.freeVariableSet.filter(function (v) {
        return v.num_constraints == 1;
      });
      LOG("free_variable_set = [" + self.freeVariableSet.toString() + "]");

      constraintHierarchyPlanner(self, cnToEnforce.strength);

      if (!cnToEnforce.isSatisfied()) {
        LOG("Could not enforce the constraint: " + cnToEnforce.id);

        /*
         * the constraint could not be enforced; 
         * undo the alterations to the constraint graph
         */
        while (self.undoStack.size() > 0) {
          var element = self.undoStack.pop();
          var cn = element.cn;
          var restored_method = element.mt;

          if (cn.selected_method != null) {
            cn.selected_method.outputs.each(function (v) {
              v.determined_by = null;
            });
          }
          if (restored_method != null) {
            restored_method.outputs.each(function (v) {
              v.determined_by = cn;
            });
          }
          cn.selected_method = restored_method;
          LOG("Undo by restoring: " + cn.id + ".selected_method := " + restored_method.id);
        }
      }
      else if (Strength.compare(self.strongestRetractedStrength, Strength.WEAKEST) > 0) {
        /* TODO if not input constraint */
        /* 
         * if enforced,
         * collect unenforced constraints only if a constraint was retracted 
         * and the enforced constraint is not an input constraint.
         * 
         * collect unenforced constraints that are downstreams of either
         * the newly undetermined variables or the outputs of the newly
         * enforced constraint.
         */
        var undeterminedVars = new HashSet();

        self.potentialUndeterminedVars.each(function (v) {
          if (v.determined_by == null) undeterminedVars.add(v);
        });
        self.freeVariableSet.each(function (v) {
          if (v.determined_by == null && v.mark == POTENTIALLY_UNDETERMINED_MARK) {
            undeterminedVars.add(v);
          }
        });

        collectUnenforcedConstraints(self, undeterminedVars.toArray(), cnToEnforce);
      }
    }
  };
  
  /**
   * @param {Number} ceilingStrength
   */
  var constraintHierarchyPlanner = function (self, ceilingStrength) {
    LOG("constraint_hierarchy_planner(" + ceilingStrength + ")");

    /* try to solve all w/o considering strength */
    multiOutputPlanner(self);

    /*
     * if cn_to_enforce cannot be enforced and there is any retractable(weaker) constraint,
     * try to solve w/o weaker constraints
     */
    while (!self.cnToEnforce.isSatisfied() && self.retractableCnsQueue.size() > 0) {

      /*
       * remove the weakest retractable constraint and
       * indicate that the constraint has been removed from the set of
       * unsatisfied constraints by setting its mark field to NULL
       */
      var cn = deleteMin(self.retractableCnsQueue);
      cn.mark = NULL_MARK;

      self.strongestRetractedStrength = Strength.max(self.strongestRetractedStrength, cn.strength);

      /*
       * all of the retracted constraint's outputs become potentially
       * undetremined variables.
       */
      cn.selected_method.outputs.each(function (output) {
        output.determined_by = null;
        if (output.num_constraints > 2) {
          self.potentialUndeterminedVars.push(output);
        }
        else {
          output.mark = POTENTIALLY_UNDETERMINED_MARK;
        }
      });

      /* keep track of redeteremined constraints so they can be undone */
      self.undoStack.push( {cn : cn, mt : cn.selected_method} );
      cn.selected_method = null;
      LOG("Determined " + cn.id + ".selected_method := null");

      /* detach the constraint from associated variables */
      cn.variables.each(function (v) {
        v.num_constraints--;
        if (v.num_constraints == 1) {
          addFreeVar(self, v);
        }
      });

      /* try again w/o the retracted constraint */
      multiOutputPlanner(self);
    }
  };
  
  var multiOutputPlanner = function (self) {
    LOG("multi_output_planner()");

    while (!self.cnToEnforce.isSatisfied() && self.freeVariableSet.size() > 0) {
      /* pick an arbitrary element from the free variable set */
      var freeVar = self.freeVariableSet.shift();
      LOG("picked free_var: " + freeVar.id);

      if (freeVar.num_constraints == 1) {
        /* cn is the constraint to which free var belongs 
         * whose mark equals visited_mark (in the upstream graph) */
        var cn = null;
        for (var i = 0; i < freeVar.constraints.length; i++) {
          var c = freeVar.constraints[i];
          if (c.mark == self.visitedMark) {
            cn = c;
            break;
          }
        }
        LOG("looking at the associated constraint: " + cn);

        /*
         * if there exists a method 'mt' in cn.methods such that for all
         * variables 'var' in mt.outputs var.num_constraints = 1, mt is
         * the method with the smallest number of outputs.
         */
        var selectedMethod = findMinOutputMethodHasOnlyFreeOutputVars(cn);
        LOG("the min-output method having only free output vars: " + selectedMethod);

        if (selectedMethod != null) {
          /*
           * Any variable that is no longer output by cn and which
           * does not become a free variable is a potential
           * undetermined variable.
           */
          if (cn.isSatisfied()) {
            var diff = setDifference(cn.selected_method.outputs, selectedMethod.outputs);
            diff.each(function (v) {
              v.determined_by = null;
              if (v.num_constraints > 2) {
                self.potentialUndeterminedVars.push(v);
              }
              else {
                v.mark = POTENTIALLY_UNDETERMINED_MARK;
              }
            });
          }

          /* keep track of redetermined constraints 
           * so they can be undone if necessary */
          self.undoStack.push( {cn : cn, mt : cn.selected_method} );
          cn.selected_method = selectedMethod;

          /*
           * The output variables' determined_by fields must be set so
           * that collect_upstream_constraints can perform its reverse
           * depth-first search.
           */
          selectedMethod.outputs.each(function (v) {
            v.determined_by = cn;
          });
          LOG("Determined " + cn.id + ".selected_method := " + selectedMethod.id);

          /* remove this constraint from the graph */
          cn.variables.each(function (v) {
            v.num_constraints--;
            if (v.num_constraints == 1) addFreeVar(self, v);
          });

          /*
           * a constraint can be removed from the set of unsatisfied
           * constraints by seting its mark field to NULL
           */
          cn.mark = NULL_MARK;
        }
      }
    }
  };
  
  /**
   * Runs multi-output-planner with initial cgraph 
   * to satisfy required constraints.
   */
  var multiOutputPlannerForRequiredConstraints = function (self) {
    LOG("multi_output_planner_for_required_constraints()");

    var graph = self.graph;
    
    /* initialize num_constraints and free_variable_set */
    graph.getVariables().each(function (v) {
      v.num_constraints = v.constraints.length;
      if (v.num_constraints == 1) {
        addFreeVar(self, v);
      }
    });
    
    var unsatisfiedConstraints = [];
    graph.getConstraints().each(function (cn) {
      /* unsatisfied constraint has visited mark */
      cn.mark = self.visitedMark;
      unsatisfiedConstraints.push(cn);
    });
    
    while (unsatisfiedConstraints.size() > 0 && self.freeVariableSet.size() > 0) {
      /* pick an arbitrary element from the free variable set */
      var freeVar = self.freeVariableSet.shift();
      LOG("picked free_var: " + freeVar.id);

      if (freeVar.num_constraints == 1) {
        /* cn is the constraint to which the free var belongs */ 
        var cn = null;
        for (var i = 0; i < freeVar.constraints.length; i++) {
          var c = freeVar.constraints[i];
          if (c.mark == self.visitedMark) {
            cn = c;
            break;
          }
        }
        LOG("looking at the associated constraint: " + cn);

        /*
         * if there exists a method 'mt' in cn.methods such that for all
         * variables 'var' in mt.outputs var.num_constraints = 1, mt is
         * the method with the smallest number of outputs.
         */
        var selectedMethod = findMinOutputMethodHasOnlyFreeOutputVars(cn);
        LOG("the min-output method having only free output vars: " + selectedMethod);

        if (selectedMethod != null) {
          cn.selected_method = selectedMethod;

          /*
           * The output variables' determined_by fields must be set so
           * that collect_upstream_constraints can perform its reverse
           * depth-first search.
           */
          selectedMethod.outputs.each(function (v) {
            v.determined_by = cn;
          });
          LOG("Determined " + cn.id + ".selected_method := " + selectedMethod.id);

          /* remove this constraint from the graph */
          cn.variables.each(function (v) {
            v.num_constraints--;
            if (v.num_constraints == 1) addFreeVar(self, v);
          });

          cn.mark = NULL_MARK;
          unsatisfiedConstraints.remove(cn);
          
        }
      }
    }
    
    /* If there is remaining unsatisfied constraint, this cannot be satisfied */
    if (unsatisfiedConstraints.size() > 0) {
      var msg = "Could not satisfy some constraints: [" 
        + unsatisfiedConstraints.toString() + "]";
      throw new Error(msg);
    }
  };

  /**
   * This employs a depth-first search to collect all enforeced constraints 
   * that are upstream of the constraint to be enforced.
   * This collects (1) weaker upstream constraints that can be retractable,
   * (2) computes the number of upstream constraints to which each variable belongs,
   * and (3) collects potential free variables in the upstream component of the graph.
   * 
   * @param {Constraint} cn
   */
  var collectUpstreamConstraints = function (self, cn) {
    LOG("collect_upstream_constraint(" + cn.id + ")");

    /* mark this constraint as visited */
    cn.mark = self.visitedMark;

    /* 
     * (1) Collect weaker upstream constraints.
     * All upstream constraints whose strength is less than the strength of the
     * constraint to be enforced should be added to the retractable_cns_queue
     */
    if (Strength.compare(cn.strength, self.cnToEnforce.strength) < 0) {
      self.retractableCnsQueue.push(cn);
      LOG("added the weaker constraint [" + cn.id + "] to retractable_cns_queue");
    }

    cn.variables.each(function (v) {
      /* (2) Compute variable's num_constraints for upstream constraints */
      if (v.mark == self.visitedMark) {
        v.num_constraints++;
      }
      else {
        v.mark = self.visitedMark;
        v.num_constraints = 1;
      }

      var e = v.determined_by;
      if (e != null && e.mark != self.visitedMark) {
        /* recursively collect upstream constraints if not visited */
        collectUpstreamConstraints(self, e);
      }
      else if (v.num_constraints == 1) {
        /*
         * (3) Collect potential free variables.
         * input variables that are being visited for the first time
         * and variables that have not yet been visited by any constraint 
         * other than the constraint that outputs them are 
         * potential free variables.
         */
        addFreeVar(self, v);
      }
    });
  };
  
  /**
   * Collect unenforced constraints.
   * This will populate unenforcedCnsQueue.
   * 
   * @param {Variable[]} undeterminedVars
   * @param {Constraint} newly_enforced_cn
   */
  var collectUnenforcedConstraints = function (self, undeterminedVars, newly_enforced_cn) {
    LOG("collect_unenforced_constraints()");

    var collected_vars = setUnion(newly_enforced_cn.selected_method.outputs, undeterminedVars);
    collected_vars.each(function (v) {
      collectDownstreamUnenforcedConstraints(self, v);
    });

    /* Walkbound technique can be used here for optimization */
  };
  
  /**
   * Collects all unenforced constraints that are either attached to or 
   * downstream of v and whose strength is less than or equal to 
   * the strength of the strongest constraint retracted.
   * 
   * @param {Variable} v
   */
  var collectDownstreamUnenforcedConstraints = function (self, v) {
    LOG("collect_downstream_unenforced_constraints(" + v.id + ")");

    v.mark = self.searchMark;
    v.constraints.each(function (cn) {
      if (!cn.isSatisfied() && Strength.compare(cn.strength, self.strongestRetractedStrength) <= 0) {
        self.unenforcedCnsQueue.push(cn);
        LOG("added the constraint [" + cn.id + "] to unenforced_cns_queue");
      }
    });

    /* recursively collect by tracking downstream variables */
    v.constraints.each(function (cn) {
      if (cn.isSatisfied() && cn.mark != self.searchMark) {
        cn.mark = self.searchMark;
        cn.selected_method.outputs.each(function (w) {
          if (w.mark != self.searchMark) {
            collectDownstreamUnenforcedConstraints(self, w);
          }
        });
      }
    });
  };

  /**
   * Add a free variable to the free_variable_set.
   * @param {Variable} v
   */
  var addFreeVar = function (self, v) {
    if (self.freeVariableSet.indexOf(v) == -1) {
      self.freeVariableSet.push(v);
      LOG("added variable [" + v.id + "] to free_variable_set");
    }
  };
  
  var increaseMarks = function (self) {
    self.visitedMark++;
    if (self.visitedMark > VISITED_MARK_UPPER_BOUND) { 
      self.visitedMark = VISITED_MARK_LOW_BOUND;
    }

    self.searchMark++;
    if (self.searchMark > SEARCH_MARK_UPPER_BOUND) { 
      self.searchMark = SEARCH_MARK_LOW_BOUND;
    }
  };
  
  var Solver = Class.create(
  /** @lends hotdrink.graph.Solver# */
  {
    /**
     * @class QuickPlan incremental solver.
     * @name hotdrink.graph.Solver
     * @constructs
     * @param {hotdrink.graph.CGraph} cgraph
     */
    initialize : initialize,
    
    /**
     * Solve the given constraint graph with variables priority.
     * @function
     * @param {String[]} priority variable names in decreasing order of strength.
     * @param {boolean}  [sort]   (default is false) if true the result will be sorted topologically.
     * @returns {String[]} selected methods
     */
    solve : solve
  });

  /* Expose public objects */
  var ns = namespace.open("hotdrink.graph");
  ns.Solver = Solver;
  
}());

