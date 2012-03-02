/**
 * @fileOverview <p>{@link hotdrink.bindings.html.checkboxGroup}</p>
 * @author John Freeman
 */

//provides("hotdrink.bindings.html.checkboxGroup");

(function () {

  var common = hotdrink.bindings.html.common;

  /* TODO: Should we rather bind each individual checkbox to just splice its
   * value in or out? */
  var read = function read(views) {
    var values = $(views).filter(":checked")
                         .map(function () { return $(this).val(); })
                         .get();
    return { value : values };
  };

  var subbind = common.binder(
    common.write, common.onChange, read, common.enable, common.disable);

  var bind = function bind(view, model, boundValue) {
    /* Get the rest of the checkboxes in this group. */
    view = $(view);
    var name = view.attr("name");
    if (name) {
      view = $("input[name=" + name + "]", view.closest("form, body"));
    }
    var views = view;

    /* Now do normal binding. */
    subbind(views, model, boundValue);
  };

  namespace.open("hotdrink.bindings.html").bindCheckboxGroup = bind;

}());

