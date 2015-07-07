The HotDrink Model defined in lib/model.js represents a basic data model, like one described in an Adam specification. The Model's public interface is very small:

  * **`Model::`**
    * **`initialize(cgraph, methods, inputs)`** <br> Constructs a Model.<br>
<ul><li><b><code>set(v, value)</code></b>     <br> Sets a new value for a variable.<br>
</li><li><b><code>get(v)</code></b>            <br> Returns the current value of a variable.<br>
</li><li><b><code>[events] update()</code></b> <br> Computes new values for all the variables based on recent changes to the model, and returns a list of resulting changes.<br>
</li><li><b><code>touch(v)</code></b>          <br> Promotes the priority of a variable without changing its value. Equivalent to <code>set(v, get(v))</code>.</li></ul></li></ul>

The Model depends on the components in lib/graph/. Namely, it needs data structures for a constraint graph (CGraph in lib/graph/cgraph.js), solution graph (SGraph in lib/graph/sgraph.js), and evaluation graph (EGraph in lib/graph/egraph.js), as well as algorithms for solving (Solver in lib/graph/solver.js) and evaluation (Evaluator in lib/graph/evaluator.js).<br>
<br>
See also: <a href='ModelBehaviors.md'>ModelBehaviors</a>, <a href='ModelController.md'>ModelController</a>.