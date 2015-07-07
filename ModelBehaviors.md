The [Model](Model.md) itself is rather simple and uninteresting. We provide a means to extend it with new _behaviors_:

  * **`Model::`**
    * **`registerBehavior(name, behavior)`** <br> Adds a new Behavior to the Model. The Behavior's <code>update()</code> events will be added to those of the Model.</li></ul></li></ul>

Conceptually, a Behavior maintains the information necessary to support some rich user interface functionality. For example, a Behavior may keep an attribute <code>canBeDisabled</code> on variables, letting a user interface know that it can safely disable widgets bound to those variables.<br>
<br>
Structurally, a Behavior is very similar to a Model. It consists of a data structure with attributes on the model's variables, methods, and constraints (just like the CGraph, SGraph, and EGraph components) and an algorithm for computing and reporting new values for those attributes based on recent changes to the model (just like the Model's update() function). In fact, a Model is essentially a value propagation Behavior. The abstract interface for a Behavior is very simple:<br>
<br>
<ul><li><b><code>Behavior::</code></b>
<ul><li><b><code>initialize(model)</code></b> <br> Constructs a new Behavior for a Model.<br>
</li><li><b><code>[events] update()</code></b> <br> Computes new attributes for variables, methods, and constraints based on recent changes to the model, and returns a list of resulting changes.