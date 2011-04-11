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

  namespace.extend("hotdrink.controller.view.html.row", {
    compile : compile
  });

}());

