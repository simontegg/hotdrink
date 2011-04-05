/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.registerWidgetsForCompile}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.compile");

(function () {

  var idNo = 0;

  var makeId = function () {
    var result = "builtHtml" + idNo;
    ++idNo;
    return result;
  }

  var labelT = new Template("<label for=\"#{id}\">#{label}</label>");

  /**
   * @name hotdrink.controller.view.html.registerWidgetsForCompile
   * @description
   *   Builds visitors that translate ViewAst nodes into HTML, and registers
   *   them with a {@link hotdrink.controller.Factory}.
   *   Models {@link concept.view.Bind.registerWidgets}.
   * @function
   * @param {hotdrink.controller.Factory} factory
   */
  var registerWidgetsForCompile = function (factory) {

    factory.registerWidgets([
      { type : "row",
        compile : function (tree) {
          LOG("compiling row");
          var table = "<table class=\"row\">\n<tr>\n";
          tree.children.each(function (child) {
            var chtml = child.html;
            if (chtml.widget) {
              var label = (chtml.label) ? (chtml.label) : ("");
              table += "<td class=\"label\">\n<p>"
                     + label + " :</p>\n</td>\n"
                     + "<td class=\"widget\">\n<p>"
                     + chtml.widget + "</p>\n</td>\n";
            } else if (chtml.box) {
              table += "<td class=\"box\">\n" + chtml.box + "\n</td>\n";
            }
          });
          table += "</tr>\n</table>";
          tree.html = { box : table };
        }
      },

      { type : "column",
        compile : function (tree) {
          LOG("compiling column");
          var table = "<table class=\"column\">\n";
          tree.children.each(function (child) {
            var chtml = child.html;
            if (chtml.widget) {
              var label = (chtml.label) ? (chtml.label) : ("");
              table += "<tr>\n<td class=\"label\">\n<p>"
                     + label + " :</p>\n</td>\n"
                     + "<td class=\"widget\">\n<p>"
                     + chtml.widget + "</p>\n</td>\n</tr>\n";
            } else if (chtml.box) {
              table += "<tr><td colspan=\"2\" class=\"box\">\n"
                     + chtml.box + "\n</td></tr>\n";
            }
          });
          table += "</table>";
          tree.html = { box : table };
        }
      },

      { type : "checkbox",
        compile : function (tree) {
          LOG("compiling checkbox");
          var id = makeId();
          var result = {};
          if (tree.options.label) {
            result.label =
              labelT.evaluate({id : id, label : tree.options.label});
          }
          result.widget = "<input type=\"checkbox\" value=\"true\" id=\""
                        + id + "\" />";
          tree.html = result;
        }
      },

      { type : "checkboxGroup",
        compile : function (tree) {
        }
      },

      { type : "number",
        compile : function (tree) {
          LOG("compiling number");
          var id = makeId();
          var result = {};
          if (tree.options.label) {
            result.label =
              labelT.evaluate({id : id, label : tree.options.label});
          }
          var initialValue =
            (tree.options.value) ? (tree.options.value) : ("0");
          if (tree.options.readonly) {
            result.widget = "<span class=\"value\" id=\"id\">"
                          + initialValue + "</span>"
                          + "<span class=\"units\">" + tree.options.units
                          + "</span>";
          } else {
            result.widget = "<input type=\"text\" id=\"" + id + "\" value=\""
                          + initialValue + "\" />"
                          + "<span class=\"units\">" + tree.options.units
                          + "</span>";
          }
          tree.html = result;
        }
      },

      { type : "text",
        compile : function (tree) {
          LOG("compiling text");
          var id = makeId();
          var result = {};
          if (tree.options.label) {
            result.label =
              labelT.evaluate({id : id, label : tree.options.label});
          }
          if (tree.options.readonly) {
            if (tree.options.label) {
              result.widget = "<span class=\"value\" id=\"id\">"
                            + tree.options.value + "</span>";
            } else {
              result.box = "<p id=\"id\">" + tree.options.value + "</p>";
            }
          } else {
            var initialValue =
              (tree.options.value) ? (tree.options.value) : ("");
            result.widget = "<input type=\"text\" id=\"" + id + "\" value=\""
                          + initialValue + "\" />";
          }
          tree.html = result;
        }
      },

      { type : "radioGroup",
        compile : function (tree) {
        }
      },

      { type : "selectOne",
        compile : function (tree) {
        }
      },

      { type : "selectMany",
        compile : function (tree) {
        }
      }
    ]);

  };

  namespace.open("hotdrink.controller.view.html").registerWidgetsForCompile
    = registerWidgetsForCompile;

}());

