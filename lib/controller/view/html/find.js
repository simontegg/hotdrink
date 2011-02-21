/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.registerWidgetsForFind}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.find");

(function () {

  /* Base class */

  var HtmlViewController = Class.create({
    initialize : function (elts) {
      /* Use pluralization to remind developers that this object may be either a
       * single element or an array of elements. */
      /* TODO: Will using a singleton array affect performance significantly? */
      this.elts = elts;
    }
  });

  /* Element controllers */

  var SingleElementController = Class.create(HtmlViewController, {
    identify : function () {
      return Element.identify(this.elts);
    }
  });

  var MultiElementController = Class.create(HtmlViewController, {
    identify : function () {
      return this.elts[0].name;
    }
  });

  /* Helpers for controller selector function */

  var tagNameSwitch = {
    button : "html-button",
    textarea : "html-text-multiline",
    select : "html-select",
    span : "html-span"
  };

  var inputTypeSwitch = {
    text : "html-text-oneline",
    password : "html-text-oneline",
    checkbox : "html-checkbox",
    radio : "html-radio",
    button : "html-button"
  };

  var widgetTypeOf = function (view) {
    var type;
    var elt = view.elts;
    if (Object.isArray(elt)) {
      elt = elt[0];
    }
    var tag = elt.tagName.toLowerCase();
    if (tag === "input") {
      type = inputTypeSwitch[elt.type];
      if (type == "html-checkbox"
          && Object.isArray(view.elts))
      {
        type = type + "-multi";
      }
    } else {
      type = tagNameSwitch[tag];
    }
    if (!type) {
      type = null;
    }
    return type;
  };

  var getParents = function (elt, selector) {
    var result = elt.ancestors();
    if (selector) {
      result = result.filter(function (p) {
        return p.match(selector);
      });
    }
    return result;
  };

  var findById = function (id) {
    var elt = $(id);
    if (!elt) {
      return null;
    }
    var view = null;
    if (elt.type
        && (elt.type === "radio" || elt.type === "checkbox")
        && elt.name)
    {
      var form = getParents(elt, "form")[0];
      ASSERT(form,
        "expected parent form element");
      view = new MultiElementController($A(form[elt.name]));
    } else {
      view = new SingleElementController(elt);
    }
    return view;
  };

  var findByTree = function (tree) {
    var view = findById(tree.options.id);
    ASSERT(widgetTypeOf(view) === tree.type,
      "specified type did not match widget found");
    return view;
  };

  /**
   * @name hotdrink.controller.view.html.registerWidgetsForFind
   * @description
   *   Builds visitors that handle finding HTML widgets existing in the DOM and
   *   registers them with a {@link hotdrink.controller.Factory}.
   *   Models {@link concept.view.Bind.registerWidgets}.
   * @function
   * @param {hotdrink.controller.Factory} factory
   */
  var registerWidgetsForFind = function (factory) {
    factory.registerWidgets([
      {
        type : [
          "html-button",
          "html-text-oneline",
          "html-text-multiline",
          "html-select",
          "html-span",
          "html-checkbox",
          "html-checkbox-multi",
          "html-radio"
        ],
        find : findByTree
      }
    ]);
  };

  var findTree = function (variables) {
    var tree = [];
    variables.each(function (v) {
      var view = findById(v);
      if (view) {
        var type = widgetTypeOf(view);
        var elt = (Object.isArray(view)) ? (view[0]) : (view);
        ASSERT(type,
          "unsupported widget bound to " + v + ": " + elt.inspect());
        LOG(type + " bound to " + v);
        tree.push({
          type : type,
          options : {
            id : v,
            bindValue : v
          }
        });
      }
    });
    return tree;
  };

  /**
   * @name hotdrink.conroller.view.html
   * @namespace
   *   Holds all of the register functions used to implement support for the
   *   standard HTML widget set.
   */
  namespace.extend("hotdrink.controller.view.html", {
    registerWidgetsForFind : registerWidgetsForFind,
    findTree : findTree
  });

}());
