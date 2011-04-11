/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.row}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.row");

(function () {

  var compile = function (tree) {
    LOG("compiling " + tree.type);
    var table = "<table class=\"row\">\n<tr>\n";
    tree.children.each(function (child) {
      var chtml = child.html;
      if (chtml.widget) {
        var label = (chtml.label) ? (chtml.label) : ("");
        table += "<td class=\"label\">\n"
               + label + "\n</td>\n"
               + "<td class=\"widget\">\n"
               + chtml.widget + "\n</td>\n";
      } else if (chtml.box) {
        table += "<td class=\"box\">\n" + chtml.box + "\n</td>\n";
      }
    });
    table += "</tr>\n</table>";
    tree.html = { box : table };
  };

  var build = function (tree) {
    LOG("building " + tree.type);
    var row = new Element("tr");
    tree.children.each(function (child) {
      var celt = child.element;
      if (celt.widget) {
        if (celt.label) {
          row.insert(
            new Element("td", { "class" : "label" })
              .update(celt.label));
        }
        row.insert(
          new Element("td", { "class" : "widget" })
            .update(celt.widget));
      } else if (celt.box) {
        row.insert(
          new Element("td", { "class" : "box" })
            .insert(celt.box));
      }
    });
    tree.element = {
      box : new Element("table", { "class" : "row" }).insert(row)
    };
  };

  namespace.extend("hotdrink.controller.view.html.row", {
    compile : compile,
    build : build
  });

}());

