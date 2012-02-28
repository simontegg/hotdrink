(function () {

  var Model = function () {
    this.initial_height = hd.variable(5*300);
    this.initial_width = hd.variable(7*300);

    this.absolute_height = hd.variable(this.initial_height());
    this.absolute_width = hd.variable();

    this.relative_height = hd.variable();
    this.relative_width = hd.variable();

    this.preserve_ratio = hd.variable(true);

    hd.constraint()
      .bind("absolute_height", function () {
        return this.initial_height() * this.relative_height() / 100;
      })
      .bind("relative_height", function () {
        return 100 * this.absolute_height() / this.initial_height();
      });

    hd.constraint()
      .bind("absolute_width", function () {
        return this.initial_width() * this.relative_width() / 100;
      })
      .bind("relative_width", function () {
        return 100 * this.absolute_width() / this.initial_width();
      });

    hd.constraint()
      .bind("relative_height", function () {
        return this.preserve_ratio()
          ? this.relative_width()
          : this.relative_height();
      })
      .bind("relative_width", function () {
        return this.preserve_ratio()
          ? this.relative_height()
          : this.relative_width();
      });

    this.result = hd.computed(function () {
      return { height : this.absolute_height(),
               width : this.absolute_width() };
    });
  };

  var resize_image = {
    getModel : function () {
      return hd.model(new Model());
    }
  };

  namespace.open("hottest").resize_image = resize_image;

}());

