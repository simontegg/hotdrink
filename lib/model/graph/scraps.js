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


