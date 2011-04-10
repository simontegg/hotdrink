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

  var labelT = new Template("<p><label for=\"#{id}\">#{label}</label> :</p>");

  var compileGroup = function (type, tree) {
    LOG("compiling " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (makeId());
    var result = {};
    if (tree.options.label) {
      result.label =
        labelT.evaluate({id : id, label : tree.options.label});
    }
    result.widget = "<ul class=\"" + tree.type + "\">\n";
    var first = true;
    tree.options.items.each(function (item) {
      result.widget += "<li><input type=\"" + type + "\"";
      if (first) {
        result.widget += " id=\"" + id + "\"";
        first = false;
      }
      result.widget += " name=\"" + id
                     + "\" value=\"" + item.value + "\" />"
                     + item.name + "</li>\n";
    });
    result.widget += "</ul>";
    tree.html = result;
  };

  var compileSelect = function (size, multiple, tree) {
    LOG("compiling " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (makeId());
    var result = {};
    if (tree.options.label) {
      result.label =
        labelT.evaluate({id : id, label : tree.options.label});
    }
    result.widget = "<select id=\"" + id + "\"";
    if (size > 1) {
      result.widget += " size=\"" + size + "\"";
    }
    if (multiple) {
      result.widget += " multiple=\"multiple\"";
    }
    result.widget += ">\n";
    tree.options.items.each(function (item) {
      result.widget += "<option value=\"" + item.value + "\">"
                     + item.name + "</option>\n";
    });
    result.widget += "</select>";
    tree.html = result;
  };

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
        }
      },

      { type : "column",
        compile : function (tree) {
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
        }
      },

      { type : "commandButton",
        compile : function (tree) {
          LOG("compiling " + tree.type);
          var id = (tree.options.id) ? (tree.options.id) : (makeId());
          var button = "<p><button type=\"button\" id=\"" + id + "\">"
                     + tree.options.label + "</button></p>";
          tree.html = { box : button };
        }
      },

      { type : "checkbox",
        compile : function (tree) {
          LOG("compiling " + tree.type);
          var id = (tree.options.id) ? (tree.options.id) : (makeId());
          var result = {};
          if (tree.options.label) {
            result.label =
              labelT.evaluate({id : id, label : tree.options.label});
          }
          result.widget = "<p><input type=\"checkbox\" value=\"true\" id=\""
                        + id + "\" /></p>";
          tree.html = result;
        }
      },

      { type : "number",
        compile : function (tree) {
          LOG("compiling " + tree.type);
          var id = (tree.options.id) ? (tree.options.id) : (makeId());
          var result = {};
          if (tree.options.label) {
            result.label =
              labelT.evaluate({id : id, label : tree.options.label});
          }
          result.widget = "<p>";
          var initialValue =
            (tree.options.value) ? (tree.options.value) : ("0");
          if (tree.options.readonly) {
            result.widget += "<span class=\"number\" id=\"" + id + "\">"
                           + initialValue + "</span>";
          } else {
            result.widget += "<input type=\"text\" id=\"" + id + "\" value=\""
                           + initialValue + "\" />";
          }
          result.widget += "<span class=\"units\">" + tree.options.units
                         + "</span></p>";
          tree.html = result;
        }
      },

      { type : "text",
        compile : function (tree) {
          LOG("compiling " + tree.type);
          var id = (tree.options.id) ? (tree.options.id) : (makeId());
          var result = {};
          if (tree.options.label) {
            result.label =
              labelT.evaluate({id : id, label : tree.options.label});
          }
          if (tree.options.readonly) {
            var html = "<p><span class=\"value\" id=\"id\">"
                     + tree.options.value + "</span></p>";
            if (tree.options.label) {
              result.widget = html;
            } else {
              result.box = html;
            }
          } else {
            var initialValue =
              (tree.options.value) ? (tree.options.value) : ("");
            if (tree.options.lines) {
              result.widget = "<p><textarea id=\"" + id + "\" cols=\"30\" rows=\""
                            + tree.options.lines + "\">"
                            + initialValue + "</textarea></p>";
            } else {
              result.widget = "<p><input type=\"text\" id=\"" + id + "\" value=\""
                            + initialValue + "\" /></p>";
            }
          }
          tree.html = result;
        }
      },

      { type : "checkboxGroup",
        compile : function (tree) {
          compileGroup("checkbox", tree);
        }
      },

      { type : "radioGroup",
        compile : function (tree) {
          compileGroup("radio", tree);
        }
      },

      { type : "dropdown",
        compile : function (tree) {
          compileSelect(1, false, tree);
        }
      },

      { type : "selectOne",
        compile : function (tree) {
          compileSelect(tree.options.size, false, tree);
        }
      },

      { type : "selectMany",
        compile : function (tree) {
          compileSelect(tree.options.size, true, tree);
        }
      }
    ]);

  };

  namespace.open("hotdrink.controller.view.html").registerWidgetsForCompile
    = registerWidgetsForCompile;

}());

