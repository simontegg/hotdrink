<?php
// ISSUES
// 1. while changing the value of max, it affects other values too soon. 
//    e.g. when 200 is typed for max the 'value' will change instantly to be 2 
// 2. values are interpreted as string type, and lexicographic comparison is done.
//    e.g. "9" > "10", so value=9, min=10 can occur 

$sheet = <<<EOS
sheet dialog
{
  interface: {
    value: 50;
    min: 0;
    max: 100;
  }

  logic: {
    relate {
// use (+var) to do numeric comparison
      value <== (+value) > (+min) ? value : min;
      min <== (+value) < (+min) ? value : min;
//      value <== value > min ? value : min;
//      min <== value < min ? value : min;
    }
    relate {
      value <== (+value) < (+max) ? value : max;
      max <== (+value) > (+max) ? value : max;
//      value <== value < max ? value : max;
//      max <== value > max ? value : max;
    }
  }
  
  output: { 
    result <== { value: value, min: min, max: max };
  }
  
  invariant: {
    check_min <== min != empty && min != "" && (+min) >= 0;
  }
}
EOS;

$layout = <<<EOS

<style type="text/css">
#dialog { width: 500px; border: 1px solid black; padding: 1em; margin: 1em; }
#dialog label { display: block; margin: .5em; }
</style>

<form id="dialog">
<table><tr>
<td>Minumum</td><td>Value</td><td>Maximum</td>
</tr>
<tr>
<td><input type="text" id="min" size="8" /></td>
<td><input type="text" id="value" size="8"/></td>
<td><input type="text" id="max" size="8"/></td>
</tr>
</table>
<button type="button" id="result">OK</button>
</form>
EOS;

?>

