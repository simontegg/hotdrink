(function () {

  var getCanBeDisabled = function (model, v) {
    return model.model.variables[v].canBeDisabled;
  };

  module("enablement");

  test("save_image", function () {
    expect(12);

    var model = hottest.save_image.getModel();
    strictEqual(model.get("file_name"), "",
      "file_name initialized");
    strictEqual(model.get("file_type"), "bmp",
      "file_type initialized");
    strictEqual(getCanBeDisabled(model, "file_name"), false,
      "file_name initially enabled");
    strictEqual(getCanBeDisabled(model, "file_type"), false,
      "file_type initially enabled");
    strictEqual(getCanBeDisabled(model, "compression_ratio"), true,
      "compression_ratio initially disabled");
    strictEqual(getCanBeDisabled(model, "image_quality"), true,
      "image_quality initially disabled");
    strictEqual(getCanBeDisabled(model, "result"), true,
      "result initially disabled");

    model.set("file_type", "jpeg");
    model.update();
    strictEqual(getCanBeDisabled(model, "compression_ratio"), false,
      "compression_ratio enabled");
    strictEqual(getCanBeDisabled(model, "image_quality"), false,
      "image_quality enabled");

    model.set("file_name", "name");
    model.update();
    strictEqual(getCanBeDisabled(model, "result"), false,
      "result enabled");

    model.set("file_type", "bmp");
    model.update();
    strictEqual(getCanBeDisabled(model, "compression_ratio"), true,
      "compression_ratio disabled");
    strictEqual(getCanBeDisabled(model, "image_quality"), true,
      "image_quality disabled");
  });

}());

