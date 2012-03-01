/**
 * @fileOverview <p>{@link hotdrink.bindings.html.checkboxGroup}</p>
 * @author John Freeman
 */

//provides("hotdrink.bindings.html.checkboxGroup");

(function () {

  var common = hotdrink.bindings.html.common;

  var write = function (views, values) {
    // Check the elements for each value present.
    $(views).each(function () {
      var subview = $(this);
      if (contains(values, subview.val())) {
        subview.prop("checked", true);
      } else {
        subview.prop("checked", false);
      }
    });
  };

  /* TODO: Should we rather bind each individual checkbox to just splice its
   * value in or out? */
  var read = function (views) {
    var values = $(views).filter(":checked")
                         .map(function () { return $(this).val(); })
                         .get();
    return { value : values };
  };

  var subbind = common.binder(
    write, common.onChange, read, common.enable, common.disable);

  var bind = function bind(view, model, getter) {
    /* Get the rest of the checkboxes in this group. */
    view = $(view);
    var name = view.attr("name");
    if (name) {
      view = $("input[name=" + name + "]", view.closest("form, body"));
    }
    var views = view;

    /* Now do normal binding. */
    subbind(views, model, getter);
  };

  namespace.open("hotdrink.bindings.html").bindCheckboxGroup = bind;

}());

