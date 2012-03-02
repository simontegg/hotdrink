(function () {

  var Model = function () {
    this.file_name = hd.variable("");
    this.file_type = hd.variable("bmp");
    this.compression_ratio = hd.variable(100);
    this.image_quality = hd.variable(100);

    hd.constraint()
      .method("compression_ratio", function () {
        return (100 - (4 * (100 - this.image_quality())));
      })
      .method("image_quality", function () {
        return (100 - ((100 - this.compression_ratio()) / 4));
      });

    hd.invariant(function () { return this.file_name() !== ""; });

    this.result = hd.command(function () {
      var r = { type : this.file_type(), name : this.file_name() };
      if (this.file_type() === "jpeg") r.ratio = this.compression_ratio();
      return r;
    });
  };

  var save_image = {
    getModel : function () {
      return hd.model(new Model());
    }
  };

  namespace.open("hottest").save_image = save_image;

}());

