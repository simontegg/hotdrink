/**
 * @fileOverview <p>{@link hotdrink.behavior.EnablementGraph}</p>
 * @author John Freeman
 */

//provides("hotdrink.behavior.EnablementGraph");

(function () {

  var EnablementGraphVariable = Class.create({
    initialize : function () {
      /* TODO: Initialize to neither true nor false so that first determination
       * triggers appropriate events? */
      this.isBlamed = false;
      this.isPoisoned = false;
      this.isRelevant = true;
      this.canBeRelevant = true;
      /* Not applicable to every variable, but cached here anyway. */
      this.canBeDisabled = false;
    }
  });

  /**
   * Blame the variable v and each variable that was definitely used to
   * determine the value of v.
   * @name blame
   * @function
   * @inner
   * @param {hotdrink.Model} model
   * @param {hotdrink.behavior.EnablementGraph} ngraph
   * @param {String} v
   */
  var blame = function (model, ngraph, v) {
    /* If this variable has already been visited, then we can go home early. */
    var nv = ngraph.variables.get(v);
    if (nv.isBlamed) {
      return;
    }
    /* Blame this variable. */
    ngraph.variables.get(v).isBlamed = true;
    /* If this variable is derived by a method, */
    var m = model.sgraph.variables.get(v).writtenBy;
    if (m !== "") {
      /* then blame each of its used inputs. */
      model.egraph.methods.get(m).inputs.each(function (pair) {
        if (pair.value.isUsed) {
          blame(model, ngraph, pair.key);
        }
      });
    }
  };

  /**
   * Mark the tree rooted at v in the solution graph as poisoned.
   * @name poison
   * @function
   * @inner
   * @param {hotdrink.Model} model
   * @param {hotdrink.behavior.EnablementGraph} ngraph
   * @param {String} v
   */
  var poison = function (model, ngraph, v) {
    /* If this variable has already been visited, then we can go home early. */
    var nv = ngraph.variables.get(v);
    if (nv.isPoisoned) {
      return;
    }
    /* Poison this variable. */
    nv.isPoisoned = true;
    /* For each method that may use this variable, */
    /* TODO: Maybe "for each method that /does/ use this variable"? */
    model.cgraph.variables.get(v).usedBy.each(function (m) {
      /* if it is in the current solution graph, */
      if (model.sgraph.methods.get(m).isSelected) {
        /* then poison each of its outputs. */
        model.cgraph.methods.get(m).outputs.each(function (v) {
          poison(model, ngraph, v);
        });
      }
    });
  };

  /**
   * Determine poison and blame for each variable.
   * @name doCommandActivation
   * @function
   * @inner
   * @param {hotdrink.Model} model
   * @param {hotdrink.behavior.EnablementGraph} ngraph
   * @returns {String[]} List of poisoned outputs.
   */
  var doCommandActivation = function (model, ngraph) {
    ngraph.variables.each(function (pair) {
      pair.value.isBlamed = false;
      pair.value.isPoisoned = false;
    });

    model.invariants.each(function (v) {
      if (!model.egraph.variables.get(v).value) {
        blame(model, ngraph, v);
      }
    });

    model.sgraph.variables.each(function (pair) {
      var v = pair.key;
      if (pair.value.isSource() &&
          ngraph.variables.get(v).isBlamed)
        poison(model, ngraph, v);
    });

    return model.outputs.filter(function (v) {
      return ngraph.variables.get(v).isPoisoned;
    });
  };

  /**
   * Mark the ancestor tree of v in the solution graph as relevant. A variable
   * is relevant if there exists a path in the solution graph from it to an
   * output variable. This function ends recursion early when it sees the
   * relevance mark, so it should be the only function to mark relevance.
   * @name markRelevant
   * @function
   * @inner
   * @param {hotdrink.Model} model
   * @param {hotdrink.behavior.EnablementGraph} ngraph
   * @param {String} v
   */
  var markRelevant = function (model, ngraph, v) {
    /* If this variable has already been visited, then we can go home early. */
    var nv = ngraph.variables.get(v);
    if (nv.isRelevant) {
      return;
    }
    /* TODO: Abstract common traversal from this and blame(). */
    /* Mark this variable relevant. */
    nv.isRelevant = true;
    LOG(v + " is relevant.");
    /* If this variable is derived by a method, */
    var m = model.sgraph.variables.get(v).writtenBy;
    if (m !== "") {
      /* then mark each of its used inputs. */
      model.egraph.methods.get(m).inputs.each(function (pair) {
        if (pair.value.isUsed)
          markRelevant(model, ngraph, pair.key);
      });
    }
  };

  /**
   * Search the descendants of v in the constraint graph, until we determine
   * whether v can be relevant to an output variable after editing it.
   * @name maybeMarkCanBeRelevant
   * @function
   * @inner
   * @param {hotdrink.Model} model
   * @param {hotdrink.behavior.EnablementGraph} ngraph
   * @param {String} v
   */
  var maybeMarkCanBeRelevant = function (model, ngraph, v) {
    var mark = canBeRelevant(model, ngraph, /*w=*/v, /*visited=*/{});
    ngraph.variables.get(v).canBeRelevant = mark;
    DEBUG_BEGIN;
    if (mark && !ngraph.variables.get(v).isRelevant) {
      LOG(v + " is not relevant, but can be relevant.");
    }
    DEBUG_END;
  };
  /**
   * Recursive subprocedure of {@link maybeMarkCanBeRelevant}, which
   * initializes its extra parameters.
   * @name canBeRelevant
   * @function
   * @inner
   * @param {hotdrink.Model} model
   * @param {hotdrink.behavior.EnablementGraph} ngraph
   * @param {String} w
   *   Descendant to consider.
   * @param {Object} visited
   *   Variables marked as visited.
   */
  var canBeRelevant = function (model, ngraph, w, visited) {
    /* A single variable may be involved in multiple self-loops. That means
     * there is no getting around marking variables visited. */
    if (visited[w]) {
      return false;
    }
    visited[w] = true;

    /* Test: if we can reach a relevant variable, then we can be relevant. */
    if (ngraph.variables.get(w).isRelevant
        || ngraph.variables.get(w).canBeRelevant) {
      /* Exit early if can be relevant. */
      return true;
    }

    /* Continue traversing if relevance still unknown. */
    var ms = model.cgraph.variables.get(w).usedBy;
    for (var i = 0; i < ms.length; ++i) {
      var m = ms[i];
      /* Only find descendants through methods that are not in the current
       * solution graph. */
      if (model.sgraph.methods.get(m).isSelected) {
        continue;
      }
      var us = model.cgraph.methods.get(m).outputs;
      for (var j = 0; j < us.length; ++j) {
        var u = us[j];
        /* TODO: Would a simple check for self-loops (u == w) here before
         * recursion improve performance? */
        if (canBeRelevant(model, ngraph, u, visited)) {
          return true;
        }
      }
    }

    return false;
  };

  /**
   * Determines relevance and potential relevance for each variable.
   * @name doWidgetEnablement
   * @function
   * @inner
   * @param {hotdrink.Model} model
   * @param {hotdrink.behavior.EnablementGraph} ngraph
   */
  var doWidgetEnablement = function (model, ngraph) {
    ngraph.variables.each(function (pair) {
      pair.value.isRelevant = false;
      pair.value.canBeRelevant = false;
    });

    /* A value of a variable v can affect an output variable if it can reach an
     * output variable in the constraint graph without going through any of
     * the methods in the solution graph. */

    /* Mark all variables that can reach an output in the evaluation graph. */
    LOG("Marking relevant...");
    model.outputs.each(function (v) {
      markRelevant(model, ngraph, v);
    });

    /* Search among (1) to see if they are marked as (2) and (3). (2) was
     * marked by findReaching when cgraph was initialized. */
    LOG("Marking can be relevant...");
    model.variables.each(function (v) {
      maybeMarkCanBeRelevant(model, ngraph, v);
    });
  };

  var EnablementGraph = Class.create(
  /** @lends hotdrink.behavior.EnablementGraph# */
  {
    /**
     * @param {hotdrink.Model} model
     * @constructs
     * @class
     *   <p>
     *   Tracks blame, poison, and relevancy in order to determine which
     *   variables can or should be safely ignored. Model of
     *   {@link concept.model.Behavior}.
     *   </p>
     *   <p>
     *   Information is stored in the following structure:
     *   </p>
     *   <pre>
     *   {
     *     variables : {
     *       /variable-name/ : {
     *         isBlamed :: boolean,
     *         isPoisoned :: boolean,
     *         isRelevant :: boolean,
     *         canBeDisabled :: boolean
     *       },
     *       ...
     *     }
     *   }
     *   </pre>
     */
    initialize : function (model) {
      var ngraph = this;

      this.variables = new Hash();
      model.variables.each(function (v) {
        ngraph.variables.set(v, new EnablementGraphVariable());
      });
    },
    /**
     * @param {hotdrink.Model} model
     * @returns {String[]}
     *   List of disable/enable change events in the form
     *   "variable.canBeDisabled". The event simply states that the attribute's
     *   value has changed; its value will have to be checked separately by
     *   clients.
     * @see concept.model.Behavior#update
     */
    update : function (model) {
      doCommandActivation(model, this);
      doWidgetEnablement(model, this);

      var result = [];
      this.variables.each(function (pair) {
        var nv = pair.value;
        var nextCanBeDisabled = false;
        var cellType = model.cgraph.variables.get(pair.key).cellType;
        if (cellType === "output") {
          nextCanBeDisabled = nv.isPoisoned;
          LOG("output variable " + pair.key + " can "
            + ((nextCanBeDisabled) ? ("") : ("not ")) + "be disabled");
        } else if (cellType === "interface") {
          nextCanBeDisabled = !nv.canBeRelevant && !nv.isBlamed;
          LOG("interface variable " + pair.key + " can "
            + ((nextCanBeDisabled) ? ("") : ("not ")) + "be disabled");
        }
        /* No disable-able widget should be bound to other variable types. */
        if (nv.canBeDisabled !== nextCanBeDisabled) {
          result.push(pair.key + ".canBeDisabled");
          nv.canBeDisabled = nextCanBeDisabled;
        }
      });
      return result;
    }
  });

  /**
   * @name hotdrink.behavior
   * @namespace Pluggable behaviors.
   */
  namespace.open("hotdrink.behavior").Enablement = EnablementGraph;

}());
