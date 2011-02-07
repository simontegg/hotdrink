<?php
$sheet = <<<EOS
// ISSUES
// while I'm changing value of max, it changes min value too soon
// value is interpreted as string. "9" > "10"... changing into value=9, min=10 still works...
sheet dialog
{
  input: {
  }
  
  interface: {
    value: 50;
    min_value: 0;
    max_value: 100;
  }

  logic: {
    relate {
      value <== value > min_value ? value : min_value;
      min_value <== value < min_value ? value : min_value;
    }
    relate {
      value <== value < max_value ? value : max_value;
      max_value <== value > max_value ? value : max_value;
    }
  }
  
  output: { 
    result <== { value: value, min: min_value, max: max_value };
  }
  
  invariant: {
    check_min <== min_value != empty && min_value != "" && min_value > 0;
    //check_max <== max_value != empty && max_value != "" && max_value > 0;
  }
}
EOS;

$layout = <<<EOS

<style type="text/css">
#dialog { width: 500px; border: 1px solid black; padding: 1em; margin: 1em; }
#dialog label { display: block; margin: .5em; }
</style>

<form id="dialog">
<label>Value : <input type="text" id="value"/></label>
<label>Minumum Value : <input type="text" id="min_value" /></label>
<label>Maximum Value : <input type="text" id="max_value" /></label>
<button type="button" id="result">OK</button>
</form>
EOS;

?>

