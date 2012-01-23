(function () {

  module("value propagation");

  test("hello_world", function () {
    expect(1);

    var model = hotdrink.makeModelController({
      cgraph : hottest.hello_world.cgraph,
      methods : hottest.hello_world.methods
    });
    strictEqual(model.get("tmp"), "Hello, World!",
      "[issue 2] constant method gets executed");
  });

  test("resize_image", function () {
    expect(9);

    var model = hotdrink.makeModelController({
      cgraph : hottest.resize_image.cgraph,
      methods : hottest.resize_image.methods
    });
    strictEqual(model.get("initial_width"), 2100,
      "initialized initial_width");
    strictEqual(model.get("absolute_height"), 1500,
      "initialized absolute_height");
    strictEqual(model.get("preserve_ratio"), true,
      "initialized preserve_ratio");
    strictEqual(model.get("relative_width"), 100,
      "initialized relative_width");

    model.set("relative_width", 105);
    model.update();
    strictEqual(model.get("relative_height"), 105,
      "calculate relative_height from relative_width");
    strictEqual(model.get("absolute_height"), 1575,
      "calculate absolute_height from relative_width");

    model.set("preserve_ratio", false);
    model.update();
    strictEqual(model.get("relative_height"), 105,
      "copy old value in self-loop");

    model.set("relative_height", 100);
    model.set("preserve_ratio", true);
    model.update();
    strictEqual(model.get("relative_height"), 100,
      "preservation of more recently edited value");
    strictEqual(model.get("relative_width"), 100,
      "overwrite less recently edited value");
  });

  test("enforced_minmax", function () {
    expect(6);

    var model = hotdrink.makeModelController({
      cgraph : hottest.enforced_minmax.cgraph,
      methods : hottest.enforced_minmax.methods
    });
    model.set("min", 110);
    model.update();
    strictEqual(model.get("value"), 110,
      "min pushes value up");
    strictEqual(model.get("max"), 110,
      "min pushes max up");

    model.set("max", 90);
    model.update();
    strictEqual(model.get("value"), 90,
      "max pushes value down");
    strictEqual(model.get("min"), 90,
      "max pushes min down");

    model.set("min", 50);
    model.set("value", 40);
    model.update();
    strictEqual(model.get("value"), 50,
      "[issue 3] value bounces back above min");

    model.set("value", 100);
    model.update();
    strictEqual(model.get("value"), 90,
      "[issue 3] value bounces back below max");
  });

}());

