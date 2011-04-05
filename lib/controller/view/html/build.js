/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.registerWidgetsForBuild}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.build");

(function () {

  var idNo = 0;

  var makeId = function () {
    var result = "builtHtml" + idNo;
    ++idNo;
    return result;
  }

  var labelT = new Template("<label for=\"#{id}\">#{label}</label>");

  /**
   * @name hotdrink.controller.view.html.registerWidgetsForBuild
   * @description
   *   Builds visitors that handle the construction of HTML widgets, containers,
   *   and other elements, and registers them with a
   *   {@link hotdrink.controller.Factory}.
   *   Models {@link concept.view.Bind.registerWidgets}.
   * @function
   * @param {hotdrink.controller.Factory} factory
   */
  var registerWidgetsForBuild = function (factory) {

    factory.registerWidgets([
      { type : "row",
        build : function (tree) {
          LOG("building row");
          var box = {};
          var html = "<table class=\"row\">\n<tr>\n";
          tree.children.each(function (child) {
            var cbox = child.box;
            if (cbox.widget) {
              var label = (cbox.label) ? (cbox.label) : ("");
              html += "<td class=\"label\">\n<p>"
                    + label + " :</p>\n</td>\n"
                    + "<td class=\"widget\">\n<p>"
                    + cbox.widget + "</p>\n</td>\n";
            } else if (cbox.box) {
              html += "<td class=\"box\">\n" + cbox.box + "\n</td>\n";
            }
          });
          html += "</tr>\n</table>";
          box.box = html;
          tree.box = box;
        }
      },

      { type : "column",
        build : function (tree) {
          LOG("building column");
          var box = {};
          var html = "<table class=\"column\">\n";
          tree.children.each(function (child) {
            var cbox = child.box;
            if (cbox.widget) {
              var label = (cbox.label) ? (cbox.label) : ("");
              html += "<tr>\n<td class=\"label\">\n<p>"
                    + label + " :</p>\n</td>\n"
                    + "<td class=\"widget\">\n<p>"
                    + cbox.widget + "</p>\n</td>\n</tr>\n";
            } else if (cbox.box) {
              html += "<tr><td colspan=\"2\" class=\"box\">\n"
                    + cbox.box + "\n</td></tr>\n";
            }
          });
          html += "</table>";
          box.box = html;
          tree.box = box;
        }
      },

      { type : "checkbox",
        build : function (tree) {
          LOG("building checkbox");
          var id = makeId();
          var box = {};
          if (tree.options.label) {
            box.label = labelT.evaluate({id : id, label : tree.options.label});
          }
          box.widget = "<input type=\"checkbox\" value=\"true\" id=\""
                     + id + "\" />";
          tree.box = box;
        }
      },

      { type : "checkboxGroup",
        build : function (tree) {
        }
      },

      { type : "number",
        build : function (tree) {
          LOG("building number");
          var id = makeId();
          var box = {};
          if (tree.options.label) {
            box.label = labelT.evaluate({id : id, label : tree.options.label});
          }
          var initialValue =
            (tree.options.value) ? (tree.options.value) : ("0");
          if (tree.options.readonly) {
            box.widget = "<span class=\"value\" id=\"id\">"
                       + initialValue + "</span>"
                       + "<span class=\"units\">" + tree.options.units
                       + "</span>";
          } else {
            box.widget = "<input type=\"text\" id=\"" + id + "\" value=\""
                       + initialValue + "\" />"
                       + "<span class=\"units\">" + tree.options.units
                       + "</span>";
          }
          tree.box = box;
        }
      },

      { type : "text",
        build : function (tree) {
          LOG("building text");
          var id = makeId();
          var box = {};
          if (tree.options.label) {
            box.label = labelT.evaluate({id : id, label : tree.options.label});
          }
          if (tree.options.readonly) {
            if (tree.options.label) {
              box.widget = "<span class=\"value\" id=\"id\">"
                         + tree.options.value + "</span>";
            } else {
              box.box = "<p id=\"id\">" + tree.options.value + "</p>";
            }
          } else {
            var initialValue =
              (tree.options.value) ? (tree.options.value) : ("");
            box.widget = "<input type=\"text\" id=\"" + id + "\" value=\""
                       + initialValue + "\" />";
          }
          tree.box = box;
        }
      },

      { type : "radioGroup",
        build : function (tree) {
        }
      },

      { type : "selectOne",
        build : function (tree) {
        }
      },

      { type : "selectMany",
        build : function (tree) {
        }
      }
    ]);

  };

  namespace.open("hotdrink.controller.view.html").registerWidgetsForBuild
    = registerWidgetsForBuild;

}());

