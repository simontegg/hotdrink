/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.column}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.column");

(function () {

  var build = function (tree) {
    LOG("building " + tree.type);
    var tableE = new Element("table", { "class" : "column" });
    tree.children.each(function (child) {
      var cdom = child.dom;
      if (cdom.widget) {
        var lcellE = new Element("td", { "class" : "label" });
        if (cdom.label) {
          lcellE.update(cdom.label);
        }
        var rcellE = new Element("td", { "class" : "widget" })
                           .update(cdom.widget);
        tableE.insert(new Element("tr").insert(lcellE).insert(rcellE));
      } else if (cdom.box) {
        var cellE = new Element("td", { "class" : "box", colspan : "2" })
                          .insert(cdom.box);
        tableE.insert(new Element("tr").insert(cellE));
      }
    });
    tree.dom = { box : tableE };
  };

  namespace.extend("hotdrink.controller.view.html.column", {
    build : build
  });

}());

