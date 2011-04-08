/**
 * @fileOverview <p>{@link hotdrink.graph.CGraph}</p>
 * @author John Freeman
 */

//provides("hotdrink.graph.CGraph");

(function () {

  var DfsVisitor = Class.create({
    initialize : empty,
    //initializeVertex : empty,
    //startVertex : empty,
    discoverVertex : empty,
    finishVertex : empty
  });

  var dfs1 = function (cgraph, source, colors, visitor) {
    if (colors.get(source) !== "white") return;
    colors.set(source, "gray");
    /* Pre-order traversal. */
    visitor.discoverVertex(source);
    cgraph.variables.get(source).usedBy.each(function (m) {
      cgraph.methods.get(m).outputs.each(function (v) {
        dfs1(cgraph, v, colors, visitor);
      });
    });
    visitor.finishVertex(source);
    colors.set(source, "black");
  }

  var dfs = function (cgraph, source, visitor) {
    var colors = new Hash();
    cgraph.variables.keys().each(function (v) {
      colors.set(v, "white");
      //visitor.initializeVertex(v);
    });

    //visitor.startVertex(source);
    return dfs1(cgraph, source, colors, visitor);
  }

  var ReachingDfsVisitor = Class.create(DfsVisitor, {
    initialize : function (cv) {
      this.reaches = cv.reaches;
    },
    discoverVertex: function (w) {
      this.reaches.push(w);
    }
  });

  var findReaching = function (cgraph) {
    cgraph.variables.each(function (pair) {
      var v = pair.key;
      var cv = pair.value;
      cv.reaches = [];
      dfs(cgraph, /*source=*/v, new ReachingDfsVisitor(cv));
      LOG(v + " reaches " + Object.toJSON(cv.reaches));
    });
  }

  var CGraph = Class.create(
  /** @lends hotdrink.graph.CGraph# */
  {
    /**
     * @param {Object:CGraphAst} cgraph
     *   Constraint graph. This object can be obtained by parsing an Adam
     *   specification.
     *   <pre>
     *   CGraphAst ::=
     *   {
     *     variables : {
     *       /variable-name/ : {
     *         cellType : /cell-type/,
     *         usedBy : /method-name-list/,
     *         initializer? : /expression/
     *       },
     *       ...
     *     },
     *     methods : {
     *       /method-name/ : {
     *         inputs : /variable-name-list/,
     *         outputs : /variable-name-list/
     *       },
     *       ...
     *     },
     *     constraints : {
     *       /constraint-name/ : {
     *         methods : /method-name-list/
     *       },
     *       ...
     *     }
     *   }
     *   </pre>
     *   A "reaches" field is added to each variable. It is an array, possibly
     *   empty, of names of variables that it reaches in the constraint graph.
     *
     * @constructs
     * @class
     *   Represents the constraint graph within {@link hotdrink.Model}. Nearly
     *   models {@link concept.model.Behavior}.
     */
    initialize : function (cgraph) {
      this.variables = $H(cgraph.variables);
      this.methods = $H(cgraph.methods);
      this.constraints = $H(cgraph.constraints);

      /*
      var cgraph = this;
      cgraph.constraints.each(function (pair) {
        var c = pair.key;
        pair.value.methods.each(function (m) {
          cgraph.methods.get(m).constraint = c;
        });
      });
      */
      findReaching(this);

    },
    /**
     * Perform a depth-first search with the visitor, starting at source.
     * @param {String} source
     * @param {hotdrink.graph.CGraph.DfsVisitor} visitor
     * @private
     */
    dfs : function (source, visitor) {
      return dfs(this, source, visitor);
    }
  });

  CGraph.DfsVisitor = DfsVisitor;

  /**
   * @name hotdrink.graph
   * @namespace
   *   Namespace for the three graphs that {@link hotdrink.Model} depends upon.
   */
  var ns = namespace.open("hotdrink.graph");
  ns.CGraph = CGraph;

}());

