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
    var result = {};
    if (tree.options.label) {
      result.label = compileFieldLabel(name, tree.options.label);
    }
    result.widget = "<ul class=\"" + tree.type + "\">\n";
    /* TODO: do we want this kind of field label behavior for groups? */
    //var first = true;
    tree.options.items.each(function (item) {
      var id = makeId();
      //if (first) {
        //id = name;
        //first = false;
      //}
      result.widget += "<li><input type=\"" + type + "\" id=\"" + id
                     + "\" name=\"" + name
                     + "\" value=\"" + item.value + "\" />"
                     + compileLabel(id, item.name) + "</li>\n";
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
    var result = {};
    if (tree.options.label) {
      result.label = buildFieldLabel(name, tree.options.label);
    }
    result.widget = new Element("ul", { "class" : tree.type });
    tree.options.items.each(function (item) {
      var id = makeId();
      result.widget.insert(new Element("li")
        .insert(new Element("input",
          { type : type, id : id, name : name, value : item.value }))
        .insert(buildLabel(id, item.name)));
    });
    tree.element = result;
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

