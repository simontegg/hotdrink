/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.row}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.row");

(function () {

  var build = function (tree) {
    LOG("building " + tree.type);
    var rowE = new Element("tr");
    tree.children.each(function (child) {
      var cdom = child.dom;
      if (cdom.widget) {
        if (cdom.label) {
          rowE.insert(new Element("td", { "class" : "label" })
                            .update(cdom.label));
        }
        rowE.insert(new Element("td", { "class" : "widget" })
                          .update(cdom.widget));
      } else if (cdom.box) {
        rowE.insert(new Element("td", { "class" : "box" })
                          .insert(cdom.box));
      }
    });
    tree.dom = { box : new Element("table", { "class" : "row" }).insert(rowE) };
  };

  namespace.extend("hotdrink.controller.view.html.row", {
    build : build
  });

}());

