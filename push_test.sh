#!/bin/bash

DIR=/research/www/groups/pttlgroup/hotdrink

cd test

INDEX_SOURCES="index.php minimal.html"
CSS_SOURCES="css/index.css css/eve.css"
JS_SOURCES="js/flapjax.js js/flapjax_ext.js js/prototype.js js/hotdrink.js"
EXAMPLE_SOURCES="\
  examples/addressform.php \
  examples/alert.php \
  examples/calculator.php \
  examples/debug.php \
  examples/form.php \
  examples/grouped_options.php \
  examples/hello.php \
  examples/hotel.php \
  examples/minmax.php \
  examples/enforced_minmax.php \
  examples/multi_view.php \
  examples/preset.php \
  examples/register.php \
  examples/resize_image.php \
  examples/save_image.php \
  examples/screen.php \
  examples/surveyform.php \
  examples/temperature.php"

ssh parasol "cd $DIR; rm -rf test; mkdir test; \
   cd test; mkdir js; mkdir css; mkdir examples"
scp $INDEX_SOURCES parasol:$DIR/test/
scp $CSS_SOURCES parasol:$DIR/test/css/
scp $JS_SOURCES parasol:$DIR/test/js/
scp $EXAMPLE_SOURCES parasol:$DIR/test/examples
ssh parasol "cd $DIR; update-www -rd test"

