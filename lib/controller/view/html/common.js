/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.common}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.common");

(function () {

  /* Base controller: */

  var ViewController = Class.create({
    initialize : function (elts) {
      /* Use pluralization to remind developers that this object may be either a
       * single element or an array of elements. */
      /* TODO: Will using a singleton array affect performance significantly? */
      this.elts = elts;
    }
  });

  /* Mixins: */

  var singleIdentify = {
    identify : function () {
      return Element.identify(this.elts);
    }
  };
  var groupIdentify = {
    identify : function () {
      return this.elts[0].name;
    }
  };

  var addDebouncedListener = function (elt, events, listener) {
    events.each(function (evtName) {
      elt.observe(evtName, listener);
    });
  };
  var singleAddListener = function (elt, events, listener) {
    listener = debounce(listener, 500);
    addDebouncedListener(elt, events, listener);
  };
  var groupAddListener = function (elts, events, listener) {
    listener = debounce(listener, 500);
    elts.each(function (elt) {
      addDebouncedListener(elt, events, listener);
    });
  };

  var read = function (view) {
    return { value : Form.Element.getValue(view.elts) };
  };
  var write = function (view, value) {
    Form.Element.setValue(view.elts, value);
  };

  var singleEnable = function (view) {
    Form.Element.enable(view.elts);
  };
  var singleDisable = function (view) {
    Form.Element.disable(view.elts);
  };

  var groupEnable = function (view) {
    view.elts.each(Form.Element.enable);
  };
  var groupDisable = function (view) {
    view.elts.each(Form.Element.disable);
  };

  /* Controllers: */

  var valueB = hotdrink.controller.behavior.value;
  var enableB = hotdrink.controller.behavior.enablement;

  var onSingleChange = function (view, listener) {
    singleAddListener(view.elts, ["change", "click", "keyup"], listener);
  };

  var onGroupChange = function (view, listener) {
    groupAddListener(view.elts, ["change", "click", "keyup"], listener);
  };

  /* For now, the controller for dropdown, number, selectMany, selectOne, and
   * text. */
  var SingleController = Class.create(ViewController,
    singleIdentify, {
    bind : function (model, options) {
      if (typeof options.value === "string") {
        var v = options.value;
        valueB.bindRead(this, onSingleChange, read, model, v);
        valueB.bindWrite(model, v, write, this);
        enableB.bindEnablement(model, v, singleEnable, singleDisable, this);
      }
    }
  });

  var writeString = function (view, value) {
    view.elts.innerHTML = value;
  };

  var StringController = Class.create(ViewController,
    singleIdentify, {
    bind : function (model, options) {
      if (typeof options.value === "string") {
        valueB.bindWrite(model, options.value, writeString, this);
      }
    }
  });

  /* Builders: */

  var idNo = 0;

  var makeId = function () {
    var result = "hotdrink" + idNo;
    ++idNo;
    return result;
  }

  var buildLabelInline = function (widgetId, text) {
    return new Element("label", { "for" : widgetId }).update(text);
  };

  var buildLabelBlock = function (widgetId, text) {
    return new Element("p").insert(buildLabelInline(widgetId, text))
                           .insert(" :");
  };

  var buildString = function (text) {
    return new Element("span").insert(text);
  };

  var buildGroup = function (type, tree) {
    LOG("building " + tree.type);
    var groupName = (tree.options.id) ? (tree.options.id) : (makeId());
    var dom = {};
    var result = {
      values : [],
      elts : []
    };
    if (tree.options.label) {
      dom.label = buildLabelBlock(groupName, tree.options.label);
    }
    var listE = new Element("ul", { "class" : tree.type });
    tree.options.items.each(function (item) {
      var id = makeId();
      var elt = new Element("input", 
        { type : type, id : id, name : groupName});
      listE.insert(
        new Element("li")
              .insert(elt)
              .insert(buildLabelInline(id, item.name)));
      result.values.push(item.value);
      result.elts.push(elt);
    });
    dom.widget = listE;
    tree.dom = dom;
    return result;
  };

  var buildSelect = function (size, multiple, tree) {
    LOG("building " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (makeId());
    var dom = {};
    if (tree.options.label) {
      dom.label = buildLabelBlock(id, tree.options.label);
    }
    var selectE = new Element("select", { id : id });
    if (size > 1) {
      selectE.writeAttribute("size", size);
    }
    if (multiple) {
      selectE.writeAttribute("multiple");
    }
    tree.options.items.each(function (item) {
      selectE.insert(
        new Element("option", { value : item.value })
              .update(item.name));
    });
    dom.widget = selectE;
    tree.dom = dom;
    return selectE;
  };

  /* Export: */

  namespace.extend("hotdrink.controller.view.html.common", {
    /* Controllers: */
    ViewController : ViewController,
    SingleController : SingleController,
    StringController : StringController,
    /* Mixins: */
    singleIdentify : singleIdentify,
    groupIdentify : groupIdentify,
    singleAddListener : singleAddListener,
    groupAddListener : groupAddListener,
    read : read,
    write : write,
    singleEnable : singleEnable,
    singleDisable : singleDisable,
    groupEnable : groupEnable,
    groupDisable : groupDisable,
    /* Builders: */
    makeId : makeId,
    buildLabelInline : buildLabelInline,
    buildLabelBlock : buildLabelBlock,
    buildString : buildString,
    buildGroup : buildGroup,
    buildSelect : buildSelect
  });

}());

