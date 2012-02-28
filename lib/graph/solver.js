/**
 * @fileOverview Constraint Solver <p>{@link hotdrink.graph.Solver}</p>
 * @author Wonseok Kim
 */

//provides("hotdrink.graph.Solver");

(function () {

  var logNames = function logNames(xxxs) {
    return JSON.stringify(xxxs.map(function (xxx) {
      return xxx.name;
    }));
  };

  /**
   * The strengths of Constraints.
   *
   * The strongest strength value is 0 and weaker strengths have higher
   * values. */
  var Strength = {
    REQUIRED : 0,                // required (strongest) strength
    WEAKEST  : Number.MAX_VALUE, // weakest strength

    isWeaker : function (a, b) { return a > b; },
    isStronger : function (a, b) { return a < b; },
    pickStronger : Math.min,
    pickWeaker : Math.max
  };

  /* Marks keep track of visited variables and constraints. */
  var Mark = function Mark() {
    this.upstream = Mark.INITIAL_UPSTREAM;
    this.downstream = Mark.INITIAL_DOWNSTREAM;
  };

  Mark.UKNOWN = 0;
  Mark.POTENTIALLY_UNDETERMINED = 1;
  Mark.INITIAL_UPSTREAM = 2;
  Mark.INITIAL_DOWNSTREAM = -1;

  Mark.prototype.nextUpstream = function nextUpstream() {
    if (this.upstream === Number.MAX_VALUE)
      this.upstream = Mark.INITIAL_UPSTREAM;
    return ++this.upstream;
  };

  Mark.prototype.nextDownstream = function nextDownstream() {
    if (this.downstream === -Number.MAX_VALUE)
      this.downstream = Mark.INITIAL_DOWNSTREAM;
    return --this.downstream;
  };

  /* Variables, methods, and constraints. */
  var Variable = function (v, vv) {
    this.name = v;
    this.outer = vv;
    /* TODO: constraints doesn't change after initialization, but numConstraints
     * gets reset for every solve. Should we rename numConstraints to something
     * like numUnsatConstraints? */
    this.constraints = [];      // Array<Constraint>
    this.numConstraints = 0;
    this.mark = Mark.UNKNOWN;
    this.determinedBy = null;   // Constraint
    this.stayConstraint = null; // Constraint
  };

  Variable.prototype.isFree = function isFree() {
    return this.numConstraints === 1;
  };

  //var Method = function (mm) {
    //this.mm = mm;
    /* Exposed in SGraph. */
    //this.isSelected = false;
  //};

  var Constraint = function (c, cc, strength) {
    this.name = c;
    this.outer = cc;
    this.variables = [];      // Array<Variable>
    /* TODO: Expose strength in SGraph. */
    this.strength = strength;
    this.selectedMethod = ""; // Method
    this.mark = Mark.INITIAL_UPSTREAM;
  };

  Constraint.prototype.isRequired = function isRequired() {
    return this.strength === Strength.REQUIRED;
  };

  Constraint.prototype.isSatisfied = function isSatisfied() {
    return this.selectedMethod !== "";
  };

  /**
   * Removes the constraint of the strongest strength.
   * @param {Constraint[]} cnsQueue
   * @returns {Constraint} The removed element.
   */
  var popStrongest = function popStrongest(cnsQueue) {
    return extractMin(cnsQueue, function (ccc) {
      return ccc.strength;
    });
  };

  /**
   * Removes the constraint of the weakest strength.
   * @param {Constraint[]} cnsQueue
   * @returns {Constraint} The removed element.
   */
  var popWeakest = function popWeakest(cnsQueue) {
    return extractMax(cnsQueue, function (ccc) {
      return ccc.strength;
    });
  };

  /**
   * @class QuickPlan incremental solver.
   * @name hotdrink.graph.Solver
   * @constructs
   * @param {hotdrink.graph.Model} graph
   */
  var Solver = function (graph) {
    this.g = graph;

    this.cccToEnforce = null;
    /* constraintHierarchyPlanner : popWeakest() */
    this.retractableCnsQueue = [];       // Heap<Constraint>
    /* constraintHierarchySolver : popStrongest() */
    this.unenforcedCnsQueue = [];        // Heap<Constraint>
    this.freeVariableSet = [];           // Array<Variable>
    /* TODO: Make sure this is a set. */
    this.potentialUndeterminedVars = []; // Set<Variable>
    this.strongestRetractedStrength = Strength.WEAKEST;
    this.mark = new Mark();
    this.undoStack = [];                 // Stack<(Constraint, Method)>

    this.priorityPrev = [];

    this.constraints = {};
    Object.keys(this.g.constraints).forEach(function (c) {
      var ccc  = new Constraint(c, this.g.constraints[c], Strength.REQUIRED);
      this.constraints[c] = ccc;
      /* Need to enqueue our required constraints for the first solution. The
       * incremental solver will react to variable changes by directly adding
       * only stay constraints. */
      this.unenforcedCnsQueue.push(ccc);
    }, this);

    //this.methods = {};
    //Object.keys(this.g.methods).forEach(function (m) {
      //this.methods[m] = new Method(this.g.methods[m]);
    //}, this);

    /* Must do this after constructing required constraints because
     * addStayConstraint mutates this.g.constraints and we don't want to add a
     * stay constraint twice. */
    this.variables = {};
    Object.keys(this.g.variables).forEach(function (v) {
      this.variables[v] = new Variable(v, this.g.variables[v]);
      this.addStayConstraint(v);
    }, this);

    Object.keys(this.constraints).forEach(function (c) {
      var ccc = this.constraints[c];

      /* Need variable list for setting numConstraints,
       * need numConstraints for setting free variables,
       * only care about free variables that are outputs,
       * thus only need to add outputs to variable lists. */
      var varsOfCn = new HashSet();
      ccc.outer.methods.forEach(function (m) {
        varsOfCn.add(this.g.methods[m].outputs);
      }, this);
      varsOfCn = varsOfCn.toArray();

      varsOfCn.forEach(function (v) {
        var vvv = this.variables[v];
        ccc.variables.push(vvv);
        vvv.constraints.push(ccc);
      }, this);
    }, this);

    Object.keys(this.variables).forEach(function (v) {
      var vvv = this.variables[v];
      vvv.numConstraints = vvv.constraints.length;
      //if (vvv.isFree()) {
        //this.freeVariableSet.push(vvv);
      //}
    }, this);
  };

  /* These functions need to have a cgraph passed as 'this'. */
  Solver.prototype.addStayConstraint = function addStayConstraint(v) {
    /* Add new constant method for the variable. */
    var m = v + "_const";
    var mm = this.g.methods[m] = {
      /* TODO: Can we get away with an empty input list? */
      inputs : [v],
      outputs : [v]
    };
    //this.methods[m] = new Method(this.g, m);

    /* Add new stay constraint. */
    var c = v + "_stay";
    var cc = this.g.constraints[c] = {
      methods : [m]
    };
    var ccc = new Constraint(c, cc, Strength.WEAKEST);
    this.constraints[c] = ccc;
    this.variables[v].stayConstraint = ccc;

    return c;
  }

  /* Returns selected methods from satisfied, required constraints. */
  /* TODO: Is this necessary, or can we just directly set method.isSelected? */
  Solver.prototype.getSelectedMethods = function getSelectedMethods() {
    var result = [];
    Object.keys(this.constraints).forEach(function (c) {
      var ccc = this.constraints[c];
      LOG("GSM: constraint " + ccc.name +
          ((ccc.isRequired()) ? ("(required) ") : ("")) +
          " selected " + (ccc.selectedMethod || "nothing"));
      if (ccc.isRequired() && ccc.isSatisfied()) {
        result.push(ccc.selectedMethod);
      }
    }, this);
    return result;
  };

  Solver.prototype.multiOutputPlanner = function multiOutputPlanner() {
    LOG("    MOP: constraint to enforce = " + this.cccToEnforce.name);
    LOG("    MOP: free variables = " + logNames(this.freeVariableSet));

    while (!this.cccToEnforce.isSatisfied() && this.freeVariableSet.length > 0) {
      /* Remove an arbitrary element from the free variable set. */
      var vvvFree = this.freeVariableSet.shift();

      if (vvvFree.isFree()) {
        /* ccc = the Constraint to which vvvFree belongs whose mark equals
         * this.mark.upstream */
        var ccc = null;
        for (var i = 0; i < vvvFree.constraints.length; ++i) {
          var ccci = vvvFree.constraints[i];
          if (ccci.mark === this.mark.upstream) {
            ccc = ccci;
            break;
          }
        }

        LOG("    MOP: free variable " +
            ((vvvFree) ? (vvvFree.name) : ("(unknown)")) +
            " attached to " + ((ccc) ? (ccc.name) : ("nothing")));

        /* m = the method in ccc with the smallest number of outputs such that
         * they are all free variables */
        var mSelected = "";
        var mNumOutputs = Number.MAX_VALUE;
        ccc.outer.methods.forEach(function (m) {
          var mm = this.g.methods[m];
          /* If this method has more outputs, move on. */
          if (mm.outputs.length >= mNumOutputs) return;
          /* If this method has all free outputs, then select it. */
          var isAllFree = mm.outputs.every(function (w) {
            return this.variables[w].isFree();
          }, this);
          if (isAllFree) {
            mSelected = m;
            mNumOutputs = mm.outputs.length;
          }
        }, this);

        /* If there exists such a method, ... */
        if (mSelected !== "") {
          this.eliminateConstraint(ccc, mSelected);

          /* The output variables' determinedBy fields must be set so that
           * collectUpstreamConstraints can perform its reverse depth-first
           * search. */
          var mm = this.g.methods[mSelected];
          mm.outputs.forEach(function (w) {
            this.variables[w].determinedBy = ccc;
          }, this);

          /* A variable that cannot be made the output of a constraint and
           * which is marked 'potentially_undetermined' is a potential
           * undetermined variable. */
        } else if (vvvFree.mark === Mark.POTENTIALLY_UNDETERMINED) {
          this.potentialUndeterminedVars.push(vvvFree);
        }
      } else if (vvvFree.mark === Mark.POTENTIALLY_UNDETERMINED) {
        this.potentialUndeterminedVars.push(vvvFree);
      }
    }

    LOG("    MOP: enforced " + this.cccToEnforce.name + "? " +
        this.cccToEnforce.isSatisfied());
  };

  Solver.prototype.eliminateConstraint
    = function eliminateConstraint(ccc, mNext)
  {
    LOG(((mNext === "") ? ("retracted ") : ("eliminated ")) + ccc.name +
        ((mNext === "") ? ("") : (" by choosing " + mNext)));

    /* Any variable that is no longer output by ccc and which does not
     * become a free variable is a potential undetermined variable. */
    var mPrev = ccc.selectedMethod;
    var outputsPrev = (mPrev) ? (this.g.methods[mPrev].outputs) : [];
    var outputsNext = (mNext) ? (this.g.methods[mNext].outputs) : [];
    var newlyUndeterminedVars = setDifference(outputsPrev, outputsNext);

    newlyUndeterminedVars.forEach(function (v) {
      var vvv = this.variables[v];
      vvv.determinedBy = null;
      /* When vvv.numConstraints === 2, v is attached to ccc and one other
       * constraint, meaning it will become a free variable. (It gets added to
       * the free variable queue after we decrement v.numConstraints later.)
       * We do not want to put free variables into the potentially undetermined
       * variables queue, so we check that v.numConstraints is greater than 2.
       */
      if (vvv.numConstraints > 2) {
        this.potentialUndeterminedVars.push(vvv);
      } else {
        vvv.mark = Mark.POTENTIALLY_UNDETERMINED;
      }
    }, this);

    /* A constraint can be removed from the set of unsatisfied
     * constraints by setting its mark field to Mark.UNKNOWN. */
    ccc.mark = Mark.UNKNOWN;
    /* Keep track of redetermined constraints so they can be undone if
     * necessary. */
    this.undoStack.push([ccc, mPrev]);
    /* TODO: mPrev.isSelected = false; */
    /* TODO: mNext.isSelected = true; */
    ccc.selectedMethod = mNext;
    ccc.variables.forEach(function (vvv) {
      --vvv.numConstraints;
      LOG("variable " + vvv.name + " now has " +
          vvv.numConstraints + " constraints attached");
      if (vvv.isFree()) {
        LOG("new free variable: " + vvv.name);
        this.freeVariableSet.push(vvv);
      }
    }, this);
  };

  Solver.prototype.constraintHierarchyPlanner
    = function constraintHierarchyPlanner(ceilingStrength)
  {
    LOG("  CHP: constraint to enforce = " + this.cccToEnforce.name);
    LOG("  CHP: retractable constraints = " + logNames(this.retractableCnsQueue));

    this.multiOutputPlanner();

    while (!this.cccToEnforce.isSatisfied()
           && this.retractableCnsQueue.length > 0)
    {
      var ccc = popWeakest(this.retractableCnsQueue);
      /* TODO: Unnecessary? */
      if (!Strength.isWeaker(ccc.strength, ceilingStrength)) continue;
      this.strongestRetractedStrength
        = Strength.pickStronger(this.strongestRetractedStrength, ccc.strength);
      this.eliminateConstraint(ccc, "");
      this.multiOutputPlanner();
    }
  };

  Solver.prototype.constraintHierarchySolver
    = function constraintHierarchySolver()
  {
    LOG("CHS: constraints to enforce = " + logNames(this.unenforcedCnsQueue));

    while (this.unenforcedCnsQueue.length > 0) {
      this.cccToEnforce = popStrongest(this.unenforcedCnsQueue);
      //if (this.cccToEnforce === Mark.UNKNOWN) continue;

      this.mark.nextUpstream();
      this.mark.nextDownstream();
      this.strongestRetractedStrength = Strength.WEAKEST;
      this.undoStack.length = 0;
      this.potentialUndeterminedVars.length = 0;
      this.retractableCnsQueue.length = 0;
      this.freeVariableSet.length = 0;

      this.collectUpstreamConstraints(this.cccToEnforce);

      /* Cull from the free variable set variables that belong to more than one
       * constraint. */
      //free_variable_set = free_variable_set - { v | v.num_constraints > 1 }
      /* TODO: Use splice()? */
      this.freeVariableSet = this.freeVariableSet.filter(function (vvv) {
        return vvv.isFree();
      });

      this.constraintHierarchyPlanner(this.cccToEnforce.strength);

      if (!this.cccToEnforce.isSatisfied()) {
        this.undo();
        continue;
      }

      /* Collect unenforced constraints only if a constraint was retracted. */
      if (Strength.isStronger(
            this.strongestRetractedStrength, Strength.WEAKEST))
      {
        /* Collect unenforced constraints that are downstream of either the
         * newly undetermined variables or the outputs of the newly enforced
         * constraint. */
        var undeterminedVars = []; // Array<Variable>
        this.potentialUndeterminedVars.forEach(function (vvv) {
          if (vvv.determinedBy === null) undeterminedVars.push(vvv);
        });
        this.freeVariableSet.forEach(function (vvv) {
          if (vvv.determinedBy === null
              && vvv.mark === Mark.POTENTIALLY_UNDETERMINED)
          {
            undeterminedVars.push(vvv);
          }
        });

        this.collectUnenforcedConstraints(undeterminedVars, this.cccToEnforce);
      }
    }
  };

  /**
   * This employs a depth-first search to collect all enforeced constraints that
   * are upstream of the constraint to be enforced.  This collects (1) weaker
   * upstream constraints that can be retracted, (2) computes the number of
   * upstream constraints to which each variable belongs, and (3) collects
   * potential free variables in the upstream component of the graph.
   * 
   * @param {Constraint} ccc
   */
  Solver.prototype.collectUpstreamConstraints
    = function collectUpstreamConstraints(ccc)
  {
    LOG("CUC: upstream from " + ccc.name);

    ccc.mark = this.mark.upstream;

    /* All upstream constraints weaker than the constraint to be enforced
     * should be added to the retractable constraints queue. */
    if (Strength.isWeaker(ccc.strength, this.cccToEnforce.strength)) {
      LOG("CUC: retractable constraint = " + ccc.name);
      this.retractableCnsQueue.push(ccc);
    }

    ccc.variables.each(function (vvv) {
      /* Computation of a variable's num_constraints field */
      if (vvv.mark === this.mark.upstream) {
        ++vvv.numConstraints;
      } else {
        vvv.mark = this.mark.upstream;
        vvv.numConstraints = 1;
      }

      var cccUp = vvv.determinedBy;
      if (cccUp && cccUp.mark !== this.mark.upstream) {
        this.collectUpstreamConstraints(cccUp);
      /* Input variables that are being visited for the first time and variables
       * that have not yet been visited by any constraint other than the
       * constraint that outputs them are potential free variables. */
      } else if (vvv.isFree()) {
        LOG("CUC: free variable = " + vvv.name);
        this.freeVariableSet.push(vvv);
      }
    }, this);

  };

  Solver.prototype.undo = function undo() {
    while (this.undoStack.length > 0) {
      var item = this.undoStack.pop();
      var ccc = item[0];
      var mPrev = item[1];
      var mNext = ccc.selectedMethod;

      //mNext.isSelected = false;
      if (mNext) {
        this.g.methods[mNext].outputs.each(function (v) {
          this.variables[v].determinedBy = null;
        }, this);
      }

      //mPrev.isSelected = true;
      if (mPrev) {
        this.g.methods[mPrev].outputs.each(function (v) {
          this.variables[v].determinedBy = ccc;
        }, this);
      }

      ccc.selectedMethod = mPrev;

      LOG("UNDO: resetting method for " + ccc.name +
          " to " + mPrev + " from " + mNext);
    }
  };

  /**
   * Collect unenforced constraints.
   * This will populate unenforcedCnsQueue.
   *
   * @param {Variable[]} undeterminedVars
   * @param {Constraint} cccNewlyEnforced
   */
  Solver.prototype.collectUnenforcedConstraints
    = function collectUnenforcedConstraints(undeterminedVars, cccNewlyEnforced)
  {
    var mmNewlySelected = this.g.methods[cccNewlyEnforced.selectedMethod];
    mmNewlySelected.outputs.forEach(function (w) {
      this.collectDownstreamUnenforcedConstraints(this.variables[w]);
    }, this);

    undeterminedVars.forEach(function (vvv) {
      this.collectDownStreamUnenforcedConstraints(vvv);
    }, this);
  };

  /**
   * Collects all unenforced constraints that are either attached to or
   * downstream of vvv and who are not stronger than the strongest retracted
   * constraint.
   *
   * @param {Variable} vvv
   */
  Solver.prototype.collectDownstreamUnenforcedConstraints
    = function collectDownstreamUnenforcedConstraints(vvv)
  {
    LOG("CDUC(" + vvv.name + ")");

    vvv.mark = this.mark.downstream;

    vvv.constraints.forEach(function (ccc) {
      if (!ccc.isSatisfied()) {
        if (!Strength.isStronger(
              ccc.strength, this.strongestRetractedStrength))
        {
          this.unenforcedCnsQueue.push(ccc);
          LOG("CDUC: unenforced constraint = " + ccc.name);
        }
        return;
      }

      if (ccc.mark !== this.mark.downstream) {
        ccc.mark = this.mark.downstream;
        this.g.methods[ccc.selectedMethod].outputs.forEach(function (w) {
          var www = this.variables[w];
          if (www.mark !== this.mark.downstream) {
            this.collectDownstreamUnenforcedConstraints(www);
          }
        }, this);
      }
    }, this);
  };

  /**
   * Solve the given constraint graph with variables priority.
   *
   * @param {String[]} priority Variable names in decreasing order of strength.
   * @returns {String[]} Selected methods.
   */
  Solver.prototype.solve = function solve(priority) {
    LOG("solve: old priority = " + JSON.stringify(this.priorityPrev));
    LOG("solve: new priority = " + JSON.stringify(priority));

    /* After this loop, every variable in priority after index j will have the
     * same relative priority as in this.priorityPrev. The array slice of
     * priority up to index j should be identical to the Model's changeset. It
     * represents promoted variables. */
    var j = priority.length - 1;
    for (var i = this.priorityPrev.length - 1; i >= 0; --i) {
      if (this.priorityPrev[i] === priority[j]) {
        --j;
      }
    }

    var changeset = priority.slice(0, j + 1);
    LOG("solve: changeset = " + JSON.stringify(changeset));

    if (changeset.length > 0) {
      /* TODO: This should be done outside the Solver so that clients can control
       * the solution. */
      priority.forEach(function (v, i) {
        this.variables[v].stayConstraint.strength = i + 1;
      }, this);

      /* Try to change the solution so that we can enforce the stay constraints
       * of promoted variables. */
      changeset.forEach(function (v) {
        this.unenforcedCnsQueue.push(this.variables[v].stayConstraint);
      }, this);

      this.constraintHierarchySolver();
    }

    this.priorityPrev = priority.slice();

    var plan = this.getSelectedMethods();
    LOG("solve: plan = " + JSON.stringify(plan));
    return plan;
  };

  namespace.open("hotdrink.graph").Solver = Solver;

}());

