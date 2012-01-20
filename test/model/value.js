(function () {

  module("model");

  test("resize image", function () {
    var model = hotdrink.makeModelController({
      cgraph : hottest.resize_image.cgraph,
      methods : hottest.resize_image.methods
    });
    equal(model.get("initial_width"), 2100,
      "initialized with constant numeric expression");
    equal(model.get("absolute_height"), 1500,
      "initialized with variable numeric expression");
    equal(model.get("preserve_ratio"), true,
      "initialized with constant boolean expression");
    equal(model.get("relative_width"), 100,
      "initialized with evaluation phase");

    model.set("relative_width", 105);
    model.update();
    equal(model.get("absolute_height"), 1575,
      "value propagation");

    model.set("preserve_ratio", false);
    model.update();
    equal(model.get("relative_height"), 105,
      "self-loop");

    model.set("relative_height", 100);
    model.set("preserve_ratio", true);
    model.update();
    equal(model.get("relative_width"), 100,
      "preservation of more recently edited value");
  });

}());

