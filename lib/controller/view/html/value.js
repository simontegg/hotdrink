/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.registerWidgetsForValue}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.value");

(function () {

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

  var protoRead = function (view) {
    return Form.Element.getValue(view.elts);
  };
  var protoWrite = function (view, value) {
    Form.Element.setValue(view.elts, value);
  };

  /**
   * @name hotdrink.controller.view.html.registerWidgetsForValue
   * @description
   *   Builds visitors that handle value propagation for HTML widgets and
   *   registers them with a {@link hotdrink.controller.Factory}.
   *   Models {@link concept.view.Bind.registerWidgets}.
   * @function
   * @param {hotdrink.controller.Factory} factory
   */
  var registerWidgetsForValue = function (factory) {

    hotdrink.controller.behavior.value.registerWidgets(factory, [
      { type : "html-span",
        write : function (view, value) {
          view.elts.innerHTML = value;
        }
      },

      { type : "html-checkbox",
        onChange : function (view, listener) {
          /* keyup instead of keypress, otherwise we'll read the
           * value before the user's edit. */
          addListener1(view.elts, ["click", "keyup"], listener);
        },
        read : function (view) {
          return view.elts.checked;
        },
        write : function (view, value) {
          view.elts.checked = value;
        }
      },

      { type : ["html-text-oneline", "html-select"],
        onChange : function (view, listener) {
          addListener1(view.elts, ["change", "keyup"], listener);
        },
        read : protoRead,
        write : protoWrite
      },

      { type : ["html-button"],
        onChange : function (view, listener) {
          addListener1(view.elts, ["click"], listener);
        },
        read : function (view) {
          alert("You synthesized the parameters\n" + view.elts.value);
        },
        write : function (view, value) {
          view.elts.value = Object.toJSON(value);
        }
      },

      { type : "html-checkbox-multi",
        onChange : function (view, listener) {
          addListener(view.elts, ["change", "keyup"], listener);
        },
        read : protoRead,
        write : function (view, value) {
          ASSERT(Object.isArray(value),
            "expected array value for multi-checkbox");
          protoWrite(view, value);
        }
      },

      /* Same as multi-checkbox, except no type-check during write. */
      { type : "html-radio",
        onChange : function (view, listener) {
          addListener(view.elts, ["change", "keyup"], listener);
        },
        read : protoRead,
        //write : protoWrite
        write : function (view, value) {
          var oldValue = protoRead(view);
          //protoWrite(view, value);
          view.elts.each(function (elt) { elt.checked = false; });
          var checkedRadio = view.elts.find(function(elt) { return elt.value == value; });
          if (checkedRadio) {
            LOG("found checkedRadio: " + Element.inspect(checkedRadio));
            checkedRadio.checked = true; 
          }
          var newValue = protoRead(view);
          LOG("changed #" + view.identify() + ": "
              + Object.toJSON(oldValue) + " -> " + Object.toJSON(newValue));
        }
      }
    ]);

  };

  namespace.open("hotdrink.controller.view.html").registerWidgetsForValue
    = registerWidgetsForValue;

}());

