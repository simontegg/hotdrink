<?php
$sheet = <<<EOS
sheet temperature {
  interface : {
    celsius : 0;
    fahrenheit;
  }
  logic : {
    relate {
      celsius <== (fahrenheit - 32) * 5 / 9;
      fahrenheit <== (celsius * 9 / 5) + 32;
    }
  }
  output : {
    result <== celsius;
  }
}
EOS;


$layout = <<<EOS
<style type="text/css">
#dialog label { display: block; margin: .5em; }
</style>

<form id="dialog">
<fieldset>
<legend>Temperature Converter</legend>
<label>Farenheit : <input type="text" id="fahrenheit" /></label>
<label>Celsius : <input type="text" id="celsius" /></label>
</fieldset>
<button type="button" id="result">OK</button>
</form>
EOS;

?>

