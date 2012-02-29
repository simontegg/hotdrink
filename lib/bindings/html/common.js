/**
 * @fileOverview <p>{@link hotdrink.controller.view.html.common}</p>
 * @author John Freeman
 */

//provides("hotdrink.controller.view.html.common");

(function () {

  var enable = function enable(view) {
    return $(view).prop("disabled", false);
  };

  var disable = function disable(view) {
    return $(view).prop("disabled", true);
  };

  /* Export: */

  namespace.extend("hotdrink.bindings.html.common", {
    /* Controllers: */
    //ViewController : common.ViewController,
    //SingleController : SingleController,
    //buildGroupController : buildGroupController,
    //StringController : StringController,
    /* Mixins: */
    //singleIdentify : singleIdentify,
    //groupIdentify : groupIdentify,
    //singleAddListener : singleAddListener,
    //groupAddListener : groupAddListener,
    //read : read,
    //write : write,
    //singleEnable : singleEnable,
    //singleDisable : singleDisable,
    enable : enable,
    disable : disable,
    //groupEnable : groupEnable,
    //groupDisable : groupDisable,
    /* Validators: */
    //convertNumber : common.convertNumber,
    /* Builders: */
    //makeId : common.makeId,
    //buildLabelInline : common.buildLabelInline,
    //buildLabelBlock : common.buildLabelBlock,
    //buildString : common.buildString,
    //buildGroup : buildGroup,
    //buildSelect : buildSelect
  });

}());

