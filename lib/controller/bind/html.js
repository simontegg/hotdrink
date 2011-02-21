/**
 * @fileOverview <p>{@link hotdrink.controller.bind.html}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.bind.html");

(function () {

  var protoRead = Form.Element.getValue;
  var protoWrite = Form.Element.setValue;
  var protoEnable = Form.Element.enable;
  var protoEnable = Form.Element.enable;

  /**
   * @name hotdrink.controller.bind.html.registerWidgets
   * @description
   *   Builds visitors that handle various behaviors (value, enablement) for
   *   HTML widgets and registers them with a {@link hotdrink.controller.Factory}.
   *   Models {@link concept.view.Bind.registerWidgets}.
   * @function
   * @param {hotdrink.controller.Factory} factory
   */
  var registerWidgets = function (factory) {

    hotdrink.controller.behavior.value.registerWidgets(factory, [
      { type : "html-span",
        write : function (view, value) {
          view.innerHTML = value;
        }
      },

      { type : "html-checkbox",
        write : function (view, value) {
          view.checked = value;
        },
        read : function (view) {
          return view.checked;
        },
        /* keyup instead of keypress, otherwise we'll read the value before the
         * user's edit. */
        events : ["click", "keyup"]
      },

      { type : ["html-text-oneline", "html-select"],
        write : protoWrite,
        read : protoRead,
        events : ["change", "keyup"]
      },

      { type : ["html-button"],
        write : function (view, value) {
          view.value = Object.toJSON(value);
        },
        read : function (view) {
          alert("You synthesized the parameters\n" + view.value);
        },
        events : ["click"]
      },

      { type : "html-checkbox-multi",
        write : function (views, value) {
          ASSERT(Object.isArray(value),
            "expected array value for multi-checkbox");
          protoWrite(views, value);
        },
        read : protoRead,
        events : ["change", "keyup"]
      },

      { type : "html-radio",
        write : protoWrite,
        read : protoRead,
        events : ["change", "keyup"]
      }
    ]);

    hotdrink.controller.behavior.enablement.registerWidgets(factory, [
      { type : [
          "html-checkbox",
          "html-text-oneline",
          "html-select",
          "html-button"
        ],
        enable : protoEnable,
        disable : protoDisable
      },

      { type : "html-checkbox-multi",
        enable : function (views) {
          views.each(protoEnable);
        },
        disable : function (views) {
          views.each(protoDisable);
        }
      }
    ]);

  };

  /**
   * @name hotdrink.controller.bind.html
   * @namespace
   *   Support HTML widgets. Model of {@link concept.view.Bind}.
   */
  namespace.open("hotdrink.controller.bind.html").registerWidgets
    = registerWidgets;

}());

