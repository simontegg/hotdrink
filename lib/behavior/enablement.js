/**
 * @fileOverview <p>{@link hotdrink.behavior.EnablementGraph}</p>
 * @author John Freeman
 */

//provides("hotdrink.behavior.EnablementGraph");

(function () {

  /**
   * Blame the variable and each variable that was definitely used to
   * determine its value.
   * @name blame
   * @function
   * @inner
   * @param {hotdrink.Model} model
   * @param {String} variable
   */
  var blame = function (model, v) {
    /* If this variable has already been visited, then we can go home early. */
    var vv = model.variables[v];
    if (vv.isBlamed) {
      return;
    }

    /* Blame this variable. */
    vv.isBlamed = true;
    LOG("Blamed " + v);

    /* If this variable is derived by a method, */
    var m = vv.writtenBy;
    if (m !== "") {
      /* then blame each of its used inputs. */
      model.methods[m].inputsUsed.forEach(function (u) {
        blame(model, u);
      });
    }
  };

  /**
   * Mark the tree rooted at the variable in the solution graph as poisoned.
   * @name poison
   * @function
   * @inner
   * @param {hotdrink.Model} model
   * @param {String} variable
   */
  var poison = function (model, v) {
    /* If this variable has already been visited, then we can go home early. */
    var vv = model.variables[v];
    if (vv.isPoisoned) {
      return;
    }

    /* Poison this variable. */
    vv.isPoisoned = true;
    LOG("Poisoned " + v);

    /* For each method that may use this variable, */
    vv.usedBy.forEach(function (m) {
      /* if it is in the current solution graph, */
      var mm = model.methods[m];
      if (mm.isSelected) {
        /* then poison each of its outputs. */
        mm.outputs.forEach(function (w) {
          poison(model, w);
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
   * @returns {String[]} List of poisoned outputs.
   */
  var doCommandActivation = function (model) {
    model.invariants.forEach(function (v) {
      if (!model.variables[v].value) {
        blame(model, v);
      }
    });

    Object.keys(model.variables).forEach(function (v) {
      var vv = model.variables[v];
      if (vv.writtenBy === "" && vv.isBlamed) /* is blamed source */
        poison(model, v);
    });

    return model.outputs.filter(function (v) {
      return model.variables[v].isPoisoned;
    });
  };

  /**
   * Mark the ancestor tree of the variable in the solution graph as relevant. A
   * variable is relevant if there exists a path in the solution graph from it
   * to an output variable. This function ends recursion early when it sees the
   * relevance mark, so it should be the only function to mark relevance.
   * @name markRelevant
   * @function
   * @inner
   * @param {hotdrink.Model} model
   * @param {String} variable
   */
  var markRelevant = function (model, v) {
    /* If this variable has already been visited, then we can go home early. */
    var vv = model.variables[v];
    if (vv.isRelevant) {
      return;
    }
    /* TODO: Abstract common traversal from this and blame(). */
    /* Mark this variable relevant. */
    vv.isRelevant = true;
    vv.canBeRelevant = true;
    LOG(v + " is relevant.");
    /* If this variable is derived by a method, */
    var m = vv.writtenBy;
    if (m !== "") {
      /* then mark each of its used inputs. */
      model.methods[m].inputsUsed.forEach(function (u) {
        markRelevant(model, u);
      });
    }
  };

  /**
   * Search the descendants of the variable in the constraint graph, until we
   * determine whether it can be relevant to an output variable after editing
   * it.
   * @name maybeMarkCanBeRelevant
   * @function
   * @inner
   * @param {hotdrink.Model} model
   * @param {String} variable
   */
  var maybeMarkCanBeRelevant = function (model, v) {
    var mark = canBeRelevant(model, /*w=*/v, /*visited=*/{});
    model.variables[v].canBeRelevant = mark;
    DEBUG_BEGIN;
    if (mark && !model.variables[v].isRelevant) {
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
   * @param {String} w
   *   Descendant to consider.
   * @param {Object} visited
   *   Variables marked as visited.
   */
  var canBeRelevant = function (model, w, visited) {
    /* A single variable may be involved in multiple self-loops. That means
     * there is no getting around marking variables visited. */
    if (visited[w]) {
      return false;
    }
    visited[w] = true;

    /* Test: if we can reach a relevant variable, then we can be relevant. */
    var ww = model.variables[w];
    if (ww.isRelevant || ww.canBeRelevant) {
      /* Exit early if can be relevant. */
      return true;
    }

    /* Continue traversing if relevance still unknown. */
    var ms = ww.usedBy;
    /* Don't use forEach because we may need to continue or return. */
    for (var i = 0; i < ms.length; ++i) {
      /* Only find descendants through methods that are not in the current
       * solution graph. */
      var mm = model.methods[ms[i]];
      if (mm.isSelected) {
        continue;
      }
      var us = mm.outputs;
      for (var j = 0; j < us.length; ++j) {
        var u = us[j];
        /* TODO: Would a simple check for self-loops (u == w) here before
         * recursion improve performance? */
        if (canBeRelevant(model, u, visited)) {
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
   */
  var doWidgetEnablement = function (model) {
    /* A value of a variable v can affect an output variable if it can reach an
     * output variable in the constraint graph without going through any of
     * the methods in the solution graph. */

    /* Mark all variables that can reach an output in the evaluation graph. */
    LOG("Marking relevant...");
    model.outputs.forEach(function (v) {
      markRelevant(model, v);
    });

    /* Search among (1) to see if they are marked as (2) and (3). (2) was
     * marked by findReaching when cgraph was initialized. */
    LOG("Marking can be relevant...");
    Object.keys(model.variables).forEach(function (v) {
      maybeMarkCanBeRelevant(model, v);
    });
  };

  var EnablementGraph = 
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
     *         canBeRelevant :: boolean,
     *         canBeDisabled :: boolean
     *       },
     *       ...
     *     }
     *   }
     *   </pre>
     */
    initialize : function () {
      Object.keys(this.variables).forEach(function (v) {
        /* Not applicable to every variable, but cached here anyway. */
        /* TODO: Initialize to neither true nor false so that first update
         * triggers appropriate events? */
        this.variables[v].canBeDisabled = false;
      }, this);
    },

    /**
     * @param {String[]} events
     *   List of events to which disable/enable change events should be added,
     *   in the form "variable.canBeDisabled". The event simply states that the
     *   attribute's value has changed; its value will have to be checked
     *   separately by clients.
     * @see concept.model.Behavior#update
     */
    update : function (events) {
      Object.keys(this.variables).forEach(function (v) {
        var vv = this.variables[v];
        vv.isBlamed = false;
        vv.isPoisoned = false;
        vv.isRelevant = false;
        vv.canBeRelevant = false;
      }, this);

      LOG("Starting analysis for enablement behavior...");
      doCommandActivation(this);
      doWidgetEnablement(this);

      Object.keys(this.variables).forEach(function (v) {
        var vv = this.variables[v];
        var nextCanBeDisabled = false;
        if (vv.cellType === "output") {
          nextCanBeDisabled = vv.isPoisoned;
          LOG("output variable " + v + " can "
            + ((nextCanBeDisabled) ? ("") : ("not ")) + "be disabled");
        } else if (vv.cellType === "interface") {
          nextCanBeDisabled = !vv.canBeRelevant && !vv.isBlamed;
          LOG("interface variable " + v + " can "
            + ((nextCanBeDisabled) ? ("") : ("not ")) + "be disabled");
        }
        /* No disable-able widget should be bound to other variable types. */
        if (vv.canBeDisabled !== nextCanBeDisabled) {
          events.push(v + ".canBeDisabled");
          vv.canBeDisabled = nextCanBeDisabled;
        }
      }, this);
      LOG("Finished analysis for enablement behavior.");
    }

  };

  /**
   * @name hotdrink.behavior
   * @namespace Pluggable behaviors.
   */
  namespace.open("hotdrink.behavior").Enablement = EnablementGraph;

}());
