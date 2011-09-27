/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.common}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.common");

(function () {

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

  var common = hotdrink.controller.view.common;
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
  var SingleController = Class.create(common.ViewController,
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

  var buildGroupController = function (read, write) {
    var Controller = Class.create(common.ViewController,
      groupIdentify, {
      initialize : function ($super, elts, values) {
        $super(elts);
        this.values = values;
      },
      bind : function (model, options) {
        if (typeof options.value === "string") {
          var v = options.value;
          valueB.bindRead(this, onGroupChange, read, model, v);
          valueB.bindWrite(model, v, write, this);
          enableB.bindEnablement(
            model, v, groupEnable, groupDisable, this);
        }
      }
    });
    return Controller;
  };

  var writeString = function (view, value) {
    view.elts.innerHTML = value;
  };

  var StringController = Class.create(common.ViewController,
    singleIdentify, {
    bind : function (model, options) {
      if (typeof options.value === "string") {
        valueB.bindWrite(model, options.value, writeString, this);
      }
    }
  });

  /* Builders: */

  var buildGroup = function (type, tree) {
    LOG("building " + tree.type);
    var groupName = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var dom = {};
    var result = {
      values : [],
      elts : []
    };
    if (tree.options.label) {
      dom.label = common.buildLabelBlock(groupName, tree.options.label);
    }
    var listE = new Element("ul", { "class" : tree.type });
    tree.options.items.each(function (item) {
      var id = common.makeId();
      var elt = new Element("input", 
        { type : type, id : id, name : groupName});
      listE.insert(
        new Element("li")
              .insert(elt)
              .insert(common.buildLabelInline(id, item.name)));
      result.values.push(item.value);
      result.elts.push(elt);
    });
    dom.widget = listE;
    tree.dom = dom;
    return result;
  };

  var buildSelect = function (size, multiple, tree) {
    LOG("building " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var dom = {};
    if (tree.options.label) {
      dom.label = common.buildLabelBlock(id, tree.options.label);
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
    ViewController : common.ViewController,
    SingleController : SingleController,
    buildGroupController : buildGroupController,
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
    /* Validators: */
    convertNumber : common.convertNumber,
    /* Builders: */
    makeId : common.makeId,
    buildLabelInline : common.buildLabelInline,
    buildLabelBlock : common.buildLabelBlock,
    buildString : common.buildString,
    buildGroup : buildGroup,
    buildSelect : buildSelect
  });

}());

