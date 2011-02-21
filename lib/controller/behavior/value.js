/**
 * @fileOverview <p>{@link hotdrink.controller.behavior.value}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.behavior.value);

(function () {

  /**
   * @name hotdrink.controller.behavior.value.registerWidgets
   * @description
   *   Builds visitors that handle the display and editing of values and
   *   registers them with a {@link hotdrink.controller.Factory}. Models
   *   {@link concept.view.Behavior.registerWidgets}.
   * @function
   * @param {hotdrink.controller.Factory} factory
   * @param {Object:ValueBehaviorRegistry} registry
   *   <pre>
   *   ValueBehaviorRegistry ::=
   *   [ {
   *     type : [/widget-type-name/] | /widget-type-name/,
   *     write? : function (view, value) { ... },
   *     read? : function (view) { ... },
   *     events? : [/widget-event-name/]
   *   } ]
   *   </pre>
   *   <p>
   *   If a widget can display the value of a variable, then pass a write
   *   function that accepts a widget and value.
   *   </p>
   *   <p>
   *   If a widget can modify the value of a variable, then pass a read function
   *   that will return the value of a widget, and a list of names of events on
   *   the widget to which to listen for changes to its value.
   *   </p>
   * @example
   *   hotdrink.controller.behavior.value.registerWidgets(factory, [
   *     { type : "html-checkbox",
   *       write : function (view, value) {
   *         view.checked = value;
   *       },
   *       read : function (view) {
   *         return view.checked;
   *       },
   *       events : ["click", "keyup"]
   *     }
   *   ]);
   */
  var registerWidgets = function (factory, registry) {

    var nextRegistry = [];

    registry.each(function (item) {

      /* TODO: Does removing all access to item within the binder actually
       * improve performance or memory use? */
      var onChange = item.onChange;
      var read = item.read;
      var write = item.write;

      var binder = function (model, view, options) {

        var v = options.bindValue;

        DEBUG_BEGIN;
        var debugId = view.identify();
        DEBUG_END;

        if (read) {
          var readListener = function (evt) {
            DEBUG_BEGIN;
            /*
            if (Object.isArray(view)) {
              ASSERT(views.include(evt.findElement()),
                "listening for a few widgets, but heard another");
            } else {
              ASSERT(evt.findElement() === view,
                "listening for one widget, but heard another");
            }
            */
            LOG("reading #" + debugId);
            DEBUG_END;
            var value = read(view);
            model.set(v, value);
            model.update();
          };

          onChange(view, readListener);
        }

        if (write) {
          /* TODO: Share listeners among widgets of same type bound to same
           * model? */
          var writeListener = function (model2) {
            ASSERT(model2 === model,
              "listening for one model, but heard another");
            LOG("writing #" + debugId);
            var value = model2.get(v);
            write(view, value);
          };

          model.observe(v + ".value", writeListener);
        }

      };

      nextRegistry.push({
        type : item.type,
        binders : [binder]
      });

    });

    factory.registerWidgets(nextRegistry);

  };

  /**
   * @name hotdrink.controller.behavior.value
   * @namespace
   *   Support display and editing of values. Model of
   *   {@link concept.view.Behavior}.
   */
  namespace.open("hotdrink.controller.behavior.value").registerWidgets
    = registerWidgets;

}());

