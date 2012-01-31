(function () {

  var getCanBeDisabled = function (model, v) {
    return model.model.variables[v].canBeDisabled;
  };

  module("enablement");

  test("save_image", function () {
    expect(12);

    var model = hottest.save_image.getModel();
    strictEqual(model.get("file_name"), "",
      "initialized file_name");
    strictEqual(model.get("file_type"), "bmp",
      "initialized file_type");
    strictEqual(getCanBeDisabled(model, "file_name"), false,
      "initially enabled");
    strictEqual(getCanBeDisabled(model, "file_type"), false,
      "initially enabled");
    strictEqual(getCanBeDisabled(model, "compression_ratio"), true,
      "initially disabled");
    strictEqual(getCanBeDisabled(model, "image_quality"), true,
      "initially disabled");
    strictEqual(getCanBeDisabled(model, "result"), true,
      "initially disabled");

    model.set("file_type", "jpeg");
    model.update();
    strictEqual(getCanBeDisabled(model, "compression_ratio"), false,
      "enabled");
    strictEqual(getCanBeDisabled(model, "image_quality"), false,
      "enabled");

    model.set("file_name", "name");
    model.update();
    strictEqual(getCanBeDisabled(model, "result"), false,
      "enabled");

    model.set("file_type", "bmp");
    model.update();
    strictEqual(getCanBeDisabled(model, "compression_ratio"), true,
      "disabled");
    strictEqual(getCanBeDisabled(model, "image_quality"), true,
      "disabled");
  });

}());

