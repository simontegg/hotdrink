<?php
$sheet = <<<EOS
// uses Math.round javascript function
sheet screen
{
  input: {
    pixel_size: 8;
  }
  
  interface: {
    /* pixels and resolution are properties. */
    pixels: 100;
    resolution: 72;
    inches;
    file_size; // prediction
  }

  logic: {
    relate {
      pixels <== Math.round(inches*resolution);
      inches <== pixels/resolution;
      resolution <== pixels/inches;
    }
    relate {
      file_size <== pixels*pixel_size;
      pixels <== Math.round(file_size/pixel_size);
    }
  }
  
  output: {
    result <== { pixels: pixels, resolution: resolution };
  }
  
  invariant: {
    pixels_bound <== pixels < 1000; //validation
  }
}
EOS;

$html = <<<EOS
<style type="text/css">
#dialog fieldset label { display: block; margin: .5em; }
</style>

<form id="dialog">
<fieldset>
<legend>Screen</legend>
<label>Pixel Size : <span id="pixel_size"></span></label>
<label>Pixels : <input type="text" id="pixels" /></label>
<label>Resolution : <input type="text" id="resolution" /></label>
<label>Inches : <input type="text" id="inches" /></label>
<label>File Size : <input type="text" id="file_size" /></label>
</fieldset>

<button type="button" id="result">OK</button>
<button type="button" id="cancel">Cancel</button>
</form>
EOS;

$layout = <<<EOS
view {
  number (label : "Pixel Size", value : pixel_size);
  number (label : "Pixels", value : pixels);
  number (label : "Resolution", value : resolution);
  number (label : "Inches", value : inches);
  number (label : "File Size", value : file_size);
  commandButton (label : "OK", value : result);
  commandButton (label : "Cancel");
}
EOS;

?>

