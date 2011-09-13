/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.text}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.text");

(function () {

  var common = hotdrink.controller.view.html.common;

  var build = function (tree) {
    LOG("building " + tree.type);
    var id = (tree.options.id) ? (tree.options.id) : (common.makeId());
    var dom = {};
    if (tree.options.label) {
      dom.label = common.buildLabelBlock(id, tree.options.label);
    }
    if (tree.options.readonly) {
      var elt = common.buildString(tree.options.value).addClassName("string");
      tree.view = new common.StringController(elt);
      var strE = new Element("p").update(elt);
      if (tree.options.label) {
        dom.widget = strE;
      } else {
        dom.box = strE;
      }
    } else {
      var elt = null;
      if (tree.options.lines) {
        elt = new Element("textarea",
          { id : id, cols : 30, rows : tree.options.lines });
        /* TODO: implement textarea controller */
      } else {
        elt = new Element("input", { type : "text", id : id });
        tree.view = new common.SingleController(elt);
      }
      dom.widget = new Element("p").update(elt);
    }
    tree.dom = dom;
  };

  namespace.extend("hotdrink.controller.view.html.text", {
    build : build,
    Controller : common.SingleController
  });

}());

