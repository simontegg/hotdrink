(function () {

  module("value propagation");

  test("resize image", function () {
    var model = hotdrink.makeModelController({
      cgraph : resize_image.cgraph,
      methods : resize_image.methods
    });

    model.set("relative_width", 105);
    
    equal(model.get("relative_height", 105));
  });

}());

