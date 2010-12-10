var contextMenuLib = function () {

  var opened_context_menus = [];

  var stop_bubble = function (evt) { evt.stop(); return false; };

  var add_context_menu = function (element, context_menu) {
    var container = context_menu.wrap("div", { "class": "context_menu" }).hide();

    element.observe("contextmenu", function (evt) {
        /* Place the context menu. (Hide during movement.) */
        container.hide();
        container.style.left = String(evt.pointerX()) + "px";
        container.style.top = String(evt.pointerY()) + "px";
        /* Show the context menu. */
        //container.removeClassName("closed_context_menu");
        //container.addClassName("opened_context_menu");
        container.show();
        /* Register the menu for closing. */
        opened_context_menus.push(container);
        /* Don't show the system's context menu. */
        return stop_bubble(evt);
      });

    document.body.appendChild(container);
  }

  document.body.observe("mousedown", function (evt) {
      if (evt.findElement(".context_menu") == null) {
        opened_context_menus.each(function (container) {
          container.hide();
          //container.removeClassName("opened_context_menu");
          //container.addClassName("closed_context_menu");
        });
        opened_context_menus.clear();
      }
    });

  Element.addMethods({ addContextMenu: add_context_menu });

  return {
    addContextMenu : add_context_menu
  };

} ();

