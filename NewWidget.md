This tutorial will show how to add support for a new widget type using the example of the [slider widget](http://dojotoolkit.org/api/1.6/dijit/form/HorizontalSlider) from the [Dijit toolkit](http://dojotoolkit.org/reference-guide/dijit/info.html).

  1. Copy `controller/view/template.js`. We will use it as a starting point.
  1. Change the names of variables and documentation:
    * `Author` -> _your name_
    * `Toolkit` -> `dijit`
    * `Widget` -> `slider`
    * `WidgetController` -> `SliderController`
  1. Include dependencies.
> > For Dijit, you will need to `<link>` to the Dojo library, `<link>` to a theme stylesheet, and add the theme `class` to the `<body>`. Then, you will need to import the slider widgets:
```
dojo.require("dijit.form.Slider");
```
  1. Write the [controller](ViewControllers.md). Every controller needs to have at least three functions:
    * **`initialize(...)`** : The initializer is only called within the builder for the widget, so it may accept whatever parameters the designer needs. Typically it will take and store a reference to the controlled interface element. For this simple behavior, the controller can inherit from the `ViewController` provided in the namespace for view controller helpers, `hotdrink.controller.view.common`:
```
var common = hotdrink.controller.view.common;

var SliderController = Class.create(common.ViewController, {
});
```
    * **`id identify()`** : Returns a string uniquely identifying the widget. HotDrink provides a helper for creating unique identifiers:
```
var common = hotdrink.controller.view.common;

var SliderController = Class.create(common.ViewController, {
  identify : function () {
    if (!this.elts.get("id"))
      this.elts.set("id", common.makeId());
    return this.elts.get("id");
  }
});
```
    * **`bind(model, options)`** : Binds the widget to the given [model](ModelController.md) according to the given options by creating and registering listeners, i.e., event handlers. This is where the interesting work of the controller takes place. [View behaviors](ViewBehaviors.md) export helpers that we can use to write the `bind` method for our controller. To use them, however, we will first need to implement some abstractions for low-level functionality, i.e., behavior helpers.
  1. Write behavior helpers. Typically, we want to be able to re-use our helpers every time we bind a widget. In that case, it helps to write them outside the controller.
    * Reading
> > > Some widgets can edit multiple values. A range slider, for example, may be able to change both an upper and lower value: <br />
> > > <img src='http://www.telerik.com/libraries/labs_projects/slider-labs.sflb?x=.png' /> <br />
> > > For each variable that can be changed through the widget, two helper functions need to be written:
      * **`onChange(view, listener)`** : Registers a given listener to be called whenever the value in question changes.
> > > > For the Dijit slider, we can use [its `watch` method](http://dojotoolkit.org/api/1.6/dijit/form/HorizontalSlider):
```
var onChange = function (view, listener) {
  view.elts.watch("value", listener);
};
```
      * **`read(view)`** : Reads the new value from the widget. Each widget produces values of a single type, but it may not always be able, typically due to some error in conversion. For example, a number widget filled with the text "abcd" has no value. The `read` helper indicates success and failure using a pattern similar to the Error monad in Haskell.
> > > > For success, an object is returned whose `value` member is a value of the proper type:
```
{ value : 1234 }
```
> > > > For failure, an object is returned whose `error` member is a string describing the error:
```
{ error : "could not convert 'abcd' to a number" }
```
> > > > For the Dijit slider, we can use a helper function provided by HotDrink for converting numbers.
```
var read = function (view) {
  return common.convertNumber(view.elts.get("value"));
};
```

> > > Readonly widgets will not need these helpers. If that seems confusing, remember this: the helpers are named from the perspective of the model. If the user can only read the widget, then they cannot write to it, and therefore the model has no reason to read from it.
    * Writing
> > > Whenever our widget should trigger a change in the [model](Model.md), we _read_ a value from it. Whenever our widget should respond to a change in the model, we _write_ a value to it. As with reading, a widget may support multiple values for writing. For example, our slider can have its minimum and maximum bounds changed in addition to its current value. For each variable that can trigger changes in the widget, we need to write one helper function:
      * **`write(view, value)`** : Implements the widget's reaction to the changed value.
> > > > For the Dijit slider, we will use three separate writers:
```
var writeValue = function (view, value) {
  view.elts.set("value", value);
};

var writeMinimum = function (view, value) {
  view.elts.set("minimum", value);
  // Must refresh 'value' so that the slider will move its thumb.
  view.elts.set("value", view.elts.get("value"));
};

var writeMaximum = function (view, value) {
  view.elts.set("maximum", value);
  // Must refresh 'value' so that the slider will move its thumb.
  view.elts.set("value", view.elts.get("value"));
};
```
    * Other

> > > Other behaviors, like for [enablement](https://parasol.tamu.edu/groups/pttlgroup/hotdrink/doc/symbols/hotdrink.controller.behavior.enablement.html), should document the helpers they require.
  1. Finish the controller.
    * **`bind(model, options)`** : In the binder, we will check for certain options meaningful to this widget type: `value`, `minimum`, and `maximum`. If they are present, then we will need to establish appropriate communication between the widget and [model](Model.md) using event handlers. This is where HotDrink's [view behaviors](ViewBehaviors.md) and our new helpers come in:
```
var common = hotdrink.controller.view.common;
// The value view behavior.
var valueB = hotdrink.controller.behavior.value;

var SliderController = Class.create(common.ViewController, {
  identify : function () {
    if (!this.elts.get("id"))
      this.elts.set("id", common.makeId());
    return this.elts.get("id");
  },
  bind : function (model, options) {
    if (typeof options.value === "string") {
      var v = options.value;
      valueB.bindRead(this, onChange, read, model, v);
      valueB.bindWrite(model, v, writeValue, this);
    }
    if (typeof options.minimum === "string") {
      var v = options.minimum;
      valueB.bindWrite(model, v, writeMinimum, this);
    }
    if (typeof options.maximum === "string") {
      var v = options.maximum;
      valueB.bindWrite(model, v, writeMaximum, this);
    }
  }
});
```
  1. Write the [builder](https://parasol.tamu.edu/groups/pttlgroup/hotdrink/doc/symbols/concept.view.Builder.html). It will construct the controller during the processing of a [view AST](https://parasol.tamu.edu/groups/pttlgroup/hotdrink/doc/symbols/concept.view.Ast.html).

> > For the Dijit slider, we will treat it as a form widget with an optional label:
```
var build = function (tree) {
  var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
  var dom = {};
  if (tree.options.label) {
    dom.label = common.buildLabelBlock(id, tree.options.label);
  }
  var elt = new dijit.form.HorizontalSlider({
    id : id,
    value : 5,
    minimum : 0,
    maximum : 10,
    intermediateChanges : true,
    style : "width:300px;"
  });
  dom.widget = elt.get("domNode");
  tree.view = new SliderController(elt);
  tree.dom = dom;
};
```
  1. Register your builder with HotDrink.
> > When you call `hotdrink.openDialog`, you can pass your builder along with the name of the widget for which it should be used:
```
hotdrink.openDialog({
  adam : adam,
  eve : eve,
  builders : [{ type : "slider", build : build }]
});
```

The code for this tutorial has been added to the HotDrink project. The controller and builder can be found in `lib/controller/view/dijit/`. A [demo](https://parasol.tamu.edu/groups/pttlgroup/hotdrink/test/slider.php) is available online.