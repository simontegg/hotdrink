//provides("hotdrink.controller.find.html");

(function () {

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
    var elt = view;
    if (Object.isArray(view)) {
      elt = view[0];
    }
    //var elt = (Object.isArray(view)) ? (view[0]) : (view);
    LOG(Object.inspect(view));
    var tag = elt.tagName.toLowerCase();
    if (tag === "input") {
      type = inputTypeSwitch[elt.type];
      if (type == "html-checkbox"
          && Object.isArray(view))
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
      view = $A(form[elt.name]);
    } else {
      view = elt;
    }
    return view;
  };

  var findByTree = function (tree) {
    var view = findById(tree.options.id);
    ASSERT(widgetTypeOf(view) === tree.type,
      "specified type did not match widget found");
    return view;
  };

  var registerWidgets = function (factory) {
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

  namespace.extend("hotdrink.controller.find.html", {
    registerWidgets : registerWidgets,
    findTree : findTree
  });

}());

