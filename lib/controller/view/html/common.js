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

  var valueB = hotdrink.controller.behavior.value;

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

  /* Compilers: */

  var idNo = 0;

  var makeId = function () {
    var result = "hotdrink" + idNo;
    ++idNo;
    return result;
  }

  var labelT = new Template("<label for=\"#{id}\">#{text}</label>");

  var compileLabel = function (widgetId, text) {
    return labelT.evaluate({ id : widgetId, text : text });
  };

  var compileFieldLabel = function (widgetId, text) {
    return "<p>" + compileLabel(widgetId, text) + " :</p>";
  };

  var compileGroup = function (type, tree) {
    LOG("compiling " + tree.type);
    var name = (tree.options.id) ? (tree.options.id) : (makeId());
    var html = {};
    if (tree.options.label) {
      html.label = compileFieldLabel(name, tree.options.label);
    }
    html.widget = "<ul class=\"" + tree.type + "\">\n";
    /* TODO: do we want this kind of field label behavior for groups? */
    //var first = true;
    tree.options.items.each(function (item) {
      var id = makeId();
      //if (first) {
        //id = name;
        //first = false;
      //}
      html.widget += "<li><input type=\"" + type + "\" id=\"" + id
                     + "\" name=\"" + name
                     + "\" value=\"" + item.value + "\" />"
                     + compileLabel(id, item.name) + "</li>\n";
    });
    html.widget += "</ul>";
    tree.html = html;
  };

  var compileSelect = function (size, multiple, tree) {
    LOG("compiling " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (makeId());
    var html = {};
    if (tree.options.label) {
      html.label = compileFieldLabel(id, tree.options.label);
    }
    html.widget = "<select id=\"" + id + "\"";
    if (size > 1) {
      html.widget += " size=\"" + size + "\"";
    }
    if (multiple) {
      html.widget += " multiple=\"multiple\"";
    }
    html.widget += ">\n";
    tree.options.items.each(function (item) {
      html.widget += "<option value=\"" + item.value + "\">"
                     + item.name + "</option>\n";
    });
    html.widget += "</select>";
    tree.html = html;
  };

  /* Builders: */

  var buildLabel = function (widgetId, text) {
    return new Element("label", { "for" : widgetId }).update(text);
  };

  var buildFieldLabel = function (widgetId, text) {
    return new Element("p").insert(buildLabel(widgetId, text)).insert(" :");
  };

  var buildString = function (text) {
    return new Element("span").insert(text);
  };

  var buildGroup = function (type, tree) {
    LOG("building " + tree.type);
    var name = (tree.options.id) ? (tree.options.id) : (makeId());
    var element = {};
    var result = [];
    if (tree.options.label) {
      element.label = buildFieldLabel(name, tree.options.label);
    }
    element.widget = new Element("ul", { "class" : tree.type });
    tree.options.items.each(function (item) {
      var id = makeId();
      var view = new Element("input", 
        { type : type, id : id, name : name, value : item.value });
      element.widget.insert(
        new Element("li")
          .insert(view)
          .insert(buildLabel(id, item.name)));
      result.push(view);
    });
    tree.element = element;
    return result;
  };

  var buildSelect = function (size, multiple, tree) {
    LOG("building " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (makeId());
    var element = {};
    if (tree.options.label) {
      element.label = buildFieldLabel(id, tree.options.label);
    }
    element.widget = new Element("select", { id : id });
    if (size > 1) {
      element.widget.writeAttribute("size", size);
    }
    if (multiple) {
      element.widget.writeAttribute("multiple");
    }
    tree.options.items.each(function (item) {
      element.widget.insert(
        new Element("option", { value : item.value })
          .update(item.name));
    });
    tree.element = element;
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
    addListener1 : addListener1,
    addListener : addListener,
    read : read,
    write : write,
    /* Compilers: */
    makeId : makeId,
    compileLabel : compileLabel,
    compileFieldLabel : compileFieldLabel,
    compileGroup : compileGroup,
    compileSelect : compileSelect,
    /* Builders: */
    buildLabel : buildLabel,
    buildFieldLabel : buildFieldLabel,
    buildString : buildString,
    buildGroup : buildGroup
  });

}());

