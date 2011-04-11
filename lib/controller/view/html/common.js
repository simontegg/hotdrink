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

  var addListener1 = function (elt, events, listener) {
    events.each(function (evtName) {
      elt.observe(evtName, listener);
    });
  };
  var addListener = function (elts, events, listener) {
    elts.each(function (elt) {
      addListener1(elt, events, listener);
    });
  };

  var read = function (view) {
    return Form.Element.getValue(view.elts);
  };
  var write = function (view, value) {
    Form.Element.setValue(view.elts, value);
  };

  /* Controllers: */

  var onChange = function (view, listener) {
    addListener1(view.elts, ["change", "keyup"], listener);
  };

  /* For now, the controller for text, number, and dropdown. */
  var SingleController = Class.create(ViewController,
    singleIdentify, {
    bind : function (model, options) {
      if (typeof options.value === "string") {
        valueB.bindRead(this, onChange, read, model, options.value);
        valueB.bindWrite(model, options.value, write, this);
      }
    }
  });

  /* Compilers: */

  var idNo = 0;

  var makeId = function () {
    var result = "hotdrink" + idNo;
    ++idNo;
    return result;
  }

  var fieldLabelT
    = new Template("<p><label for=\"#{id}\">#{text}</label> :</p>");

  var compileFieldLabel = function (widgetId, text) {
    return fieldLabelT.evaluate({ id : widgetId, text : text });
  };

  var compileGroup = function (type, tree) {
    LOG("compiling " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (makeId());
    var result = {};
    if (tree.options.label) {
      result.label = compileFieldLabel(id, tree.options.label);
    }
    result.widget = "<ul class=\"" + tree.type + "\">\n";
    var first = true;
    tree.options.items.each(function (item) {
      result.widget += "<li><input type=\"" + type + "\"";
      if (first) {
        result.widget += " id=\"" + id + "\"";
        first = false;
      }
      result.widget += " name=\"" + id
                     + "\" value=\"" + item.value + "\" />"
                     + item.name + "</li>\n";
    });
    result.widget += "</ul>";
    tree.html = result;
  };

  var compileSelect = function (size, multiple, tree) {
    LOG("compiling " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (makeId());
    var result = {};
    if (tree.options.label) {
      result.label = compileFieldLabel(id, tree.options.label);
    }
    result.widget = "<select id=\"" + id + "\"";
    if (size > 1) {
      result.widget += " size=\"" + size + "\"";
    }
    if (multiple) {
      result.widget += " multiple=\"multiple\"";
    }
    result.widget += ">\n";
    tree.options.items.each(function (item) {
      result.widget += "<option value=\"" + item.value + "\">"
                     + item.name + "</option>\n";
    });
    result.widget += "</select>";
    tree.html = result;
  };

  /* Builders: */

  var buildFieldLabel = function (widgetId, text) {
    var labelE = new Element("label", { "for" : widgetId }).update(text);
    return new Element("p").update(labelE);
  };

  /* Export: */

  namespace.extend("hotdrink.controller.view.html.common", {
    /* Controllers: */
    ViewController : ViewController,
    SingleController : SingleController,
    /* Mixins: */
    singleIdentify : singleIdentify,
    groupIdentify : groupIdentify,
    addListener1 : addListener1,
    addListener : addListener,
    read : read,
    write : write,
    /* Compilers: */
    makeId : makeId,
    compileFieldLabel : compileFieldLabel,
    compileGroup : compileGroup,
    compileSelect : compileSelect,
    /* Builders: */
    buildFieldLabel : buildFieldLabel
  });

}());

