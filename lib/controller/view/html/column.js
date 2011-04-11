/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.column}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.column");

(function () {

  var compile = function (tree) {
    LOG("compiling " + tree.type);
    var table = "<table class=\"column\">\n";
    tree.children.each(function (child) {
      var chtml = child.html;
      if (chtml.widget) {
        var label = (chtml.label) ? (chtml.label) : ("");
        table += "<tr>\n<td class=\"label\">\n"
               + label + "\n</td>\n"
               + "<td class=\"widget\">\n"
               + chtml.widget + "\n</td>\n</tr>\n";
      } else if (chtml.box) {
        table += "<tr><td colspan=\"2\" class=\"box\">\n"
               + chtml.box + "\n</td></tr>\n";
      }
    });
    table += "</table>";
    tree.html = { box : table };
  };

  var build = function (tree) {
    LOG("building " + tree.type);
    var table = new Element("table", { "class" : "column" });
    tree.children.each(function (child) {
      var celt = child.element;
      if (celt.widget) {
        var lcell = new Element("td", { "class" : "label" });
        if (celt.label) {
          lcell.update(celt.label);
        }
        var rcell = new Element("td", { "class" : "widget" }).update(celt.widget);
        table.insert(new Element("tr").insert(lcell).insert(rcell));
      } else if (celt.box) {
        var cell = new Element("td", { "class" : "box", "colspan" : "2" })
          .insert(celt.box);
        table.insert(new Element("tr").insert(cell));
      }
    });
    tree.element = { box : table };
  };

  namespace.extend("hotdrink.controller.view.html.column", {
    compile : compile,
    build : build
  });

}());

