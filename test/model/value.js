(function () {

  module("value propagation");

  test("resize image", function () {
    var model = hotdrink.makeModelController({
      cgraph : hottest.resize_image.cgraph,
      methods : hottest.resize_image.methods
    });

    model.set("relative_width", 105);
    model.update();
    
    equal(model.get("relative_height"), 105);
  });

}());

