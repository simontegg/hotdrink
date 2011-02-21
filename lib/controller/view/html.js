/**
 * @fileOverview <p>{@link hotdrink.controller.view.html}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html");

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

  /* Common methods */

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

  var protoRead = {
    read : function () {
      return Form.Element.getValue(this.elts);
    }
  };
  var protoWrite = {
    write : function () {
      Form.Element.setValue(this.elts);
    }
  };
  var protoEnableDisable = {
    enable : function () {
      Form.Element.enable(this.elts);
    },
    disable : function () {
      Form.Element.disable(this.elts);
    }
  };
  var protoIdentify = {
    identify : function () {
      return Element.identify(this.elts);
    }
  };

  var groupIdentify = {
    identify : function () {
      return this.elts[0].name;
    }
  };

  /* Element controllers */

  var SpanController = Class.create(HtmlViewController, {
    write : function (value) {
      this.elts.innerHTML = value;
    }
  });

  var TextLineController = Class.create(HtmlViewController,
    protoRead,
    protoWrite,
    protoEnableDisable,
    protoIdentify, {
    onChange : function (listener) {
      addListener1(this.elts, ["change", "keyup"], listener);
    }
  });

  var SelectController = TextLineController;

  var CheckboxController = Class.create(HtmlViewController,
    protoEnableDisable,
    protoIdentify, {
    onChange : function (listener) {
      addListener1(this.elts, ["click", "keyup"], listener);
    },
    read : function () {
      return this.elts.checked;
    },
    write : function (value) {
      this.elts.checked = value;
    }
  });

  var ButtonController = Class.create(HtmlViewController,
    protoEnableDisable,
    protoIdentify, {
    onChange : function (listener) {
      addListener1(this.elts, ["click"], listener);
    },
    read : function () {
      alert("You synthesized the parameters\n" + this.elts.value);
    },
    write : function (value) {
      this.elts.value = Object.toJSON(value);
    }
  });

  var MultiCheckboxController = Class.create(HtmlViewController,
    protoRead,
    protoWrite,
    groupIdentify, {
    onChange : function (listener) {
      addListener(this.elts, ["change", "keyup"], listener);
    },
    enable : function () {
      this.elts.each(Form.Element.enable);
    },
    disable : function () {
      this.elts.each(Form.Element.disable);
    }
  });

  var RadioController = Class.create(HtmlViewController,
    protoRead,
    protoWrite,
    groupIdentify, {
    onChange : function (listener) {
      addListener(this.elts, ["change", "keyup"], listener);
    },
    enable : function () {
      LOG("trying to enable #" + this.identify());
    },
    disable : function () {
      LOG("trying to disable #" + this.identify());
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

  var widgetTypeOf = function (elts) {
    var type;
    var elt = elts;
    if (Object.isArray(elts)) {
      elt = elts[0];
    }
    //var elt = (Object.isArray(elts)) ? (elts[0]) : (elts);
    LOG(Object.inspect(elts));
    var tag = elt.tagName.toLowerCase();
    if (tag === "input") {
      type = inputTypeSwitch[elt.type];
      if (type == "html-checkbox"
          && Object.isArray(elts))
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

  var ControllerSwitch = {
    html_span : SpanController,
    html_text_oneline : TextLineController,
    html_select : SelectController,
    html_checkbox : CheckboxController,
    html_button : ButtonController,
    html_checkbox_multi : MultiCheckboxController,
    html_radio : RadioController
  };

  /**
   * @name hotdrink.controller.view.html.find
   * @description
   *   Takes an id, walks the DOM, and returns the identified element(s) wrapped
   *   in the appropriate controller.
   * @function
   * @param {String} id
   * @returns {concept.ViewController}
   */
  var find = function (id) {
    var elt = $(id);
    if (!elt) {
      return null;
    }
    var elts = null;
    if (elt.type
        && (elt.type === "radio" || elt.type === "checkbox")
        && elt.name)
    {
      var form = getParents(elt, "form")[0];
      ASSERT(form,
        "expected parent form element");
      elts = $A(form[elt.name]);
    } else {
      elts = elt;
    }
    /* If we have widget type names with hyphens, must convert them to
     * underscores to use in JavaScript switch (i.e. as object field name). */
    var controllerChoice = widgetTypeOf(elts).replace("-","_");
    return new ControllerSwitch[controllerChoice](elts);
  }

  /**
   * @name hotdrink.controller.view.html
   * @namespace
   *   Wrapper for HTML widgets.
   */
  namespace.open("hotdrink.controller.view.html").find
    = find;

}());

