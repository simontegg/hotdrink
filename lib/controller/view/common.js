/**
 * @fileOverview <p>{@link hotdrink.controller.view.common}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.common");

(function () {

  /* Base controller: */

  var ViewController = Class.create({
    initialize : function (elts) {
      /* Use pluralization to remind developers that this object may be either a
       * single element or an array of elements. */
      /* TODO: Will using a singleton array affect performance significantly? */
      this.elts = elts;
    }
  });

  /* Builders: */

  var idNo = 0;

  var makeId = function () {
    var result = "hotdrink" + idNo;
    ++idNo;
    return result;
  }

  var buildLabelInline = function (widgetId, text) {
    return new Element("label", { "for" : widgetId }).update(text);
  };

  var buildLabelBlock = function (widgetId, text) {
    return new Element("p").insert(buildLabelInline(widgetId, text))
                           .insert(" :");
  };

  var buildString = function (text) {
    return new Element("span").insert(text);
  };

  /* Export: */

  namespace.extend("hotdrink.controller.view.common", {
    /* Controllers: */
    ViewController : ViewController,
    /* Builders: */
    makeId : makeId,
    buildLabelInline : buildLabelInline,
    buildLabelBlock : buildLabelBlock,
    buildString : buildString,
  });

}());

