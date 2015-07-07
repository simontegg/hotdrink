Whereas a [model Behavior](ModelBehaviors.md) extends the [Model](Model.md) with new information, a view Behavior extends a [View](View.md) with a reaction to that information.

There is no abstract interface for a view Behavior. Instead, a view Behavior is a namespace for helper functions called _binders_. These binders will create and register event handlers that implement the typical reaction to an event. Often, they will require subprocedures implementing low-level interaction with the view. For example, the view Behavior in HotDrink corresponding to the model Behavior for enablement requires methods for both enabling and disabling the view:
```
var bindEnablement = function (model, v, enable, disable, view) { ... }
```

There is no requirement that a [ViewController](ViewControllers.md) use a view Behavior to handle the information from a model Behavior; these binders are provided merely to help the common case.