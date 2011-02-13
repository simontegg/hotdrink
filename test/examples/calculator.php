<?php
// Issue: although x and y are init with integer values, the type of them changes
// when inputs come from text fields, resulting in x + y being string concatenation.

$sheet = <<<EOS
sheet calulator {
  interface: {
    x: 0;
    y: 0;
    z: 0;
  }
  
  logic: {
    relate {
      z <== x + y;
    }
  }

  output: {
    result <== { z: z };
  }
}

EOS;


$layout = <<<EOS
<style type="text/css">
#dialog fieldset label { display: block; margin: .5em; }
</style>

<form id="dialog">
<fieldset>
<label>x : <input type="text" id="x" /></label>
<label>y : <input type="text" id="y" /></label>
<label>x+y = <input type="text" id="z" /></label>
</fieldset>
<button type="button" id="result">OK</button>
</form>
EOS;

?>

