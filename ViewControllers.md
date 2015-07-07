A ViewController is an abstraction over an interface element that allows its simple interaction with a [ModelController](ModelController.md). With ViewControllers, HotDrink can support bindings for any widget toolkit. The abstract interface is small:

  * **`ViewController::`**
    * **`initialize(element)`** <br> Stores a reference to the controlled interface element.<br>
<ul><li><b><code>id identify()</code></b> <br> Returns a string uniquely identifying the widget.<br>
</li><li><b><code>bind(model, options)</code></b> <br> Binds the controlled interface element to the model according to the given options. This function will establish event handlers for synchronizing information between the model and the view. To do so, it may utilize the helper functions provided in the <a href='ViewBehaviors.md'>ViewBehaviors</a>.</li></ul></li></ul>

A ViewController needs to be written for every interface element type, e.g., textboxes and dropdowns. Note that "interface element type" is a different concept than "node type" in Eve: a single node type may produce different interface element types depending on options. For example, the <code>text</code> node can be used for both readonly and interactive text, but these will be wrapped with different ViewControllers.