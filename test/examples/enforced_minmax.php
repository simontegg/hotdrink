<!-- user-defined functions -->

<script type="text/javascript">
my_min = function (a, b) { return (a < b) ? (a) : (b); };
my_max = function (a, b) { return (a < b) ? (b) : (a); };
my_first_method = function (value, min_value, max_value) {
  var t_max_value = my_max(min_value, max_value);
  /* Note: t_max_value used here so we don't have to repeat above expression. */
  var t_value = my_min(my_max(value, min_value), t_max_value);
  return [t_value, t_max_value];
}
my_second_method = function (value, min_value, max_value) {
  var t_min_value = my_min(min_value, max_value);
  /* Note: t_min_value used here so we don't have to repeat above expression. */
  var t_value = my_min(my_max(value, t_min_value), max_value);
  return [t_value, t_min_value];
}
</script>

<?php
/* This test was built to document issue #3, where user input is protected from
overwriting but sometimes shouldn't be. */

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
      value, max <== my_first_method(value, min, max);
      value, min <== my_second_method(value, min, max);
    }
  }
  
  output: { 
    result <== { value: value, min: min, max: max };
  }
  
  invariant: {
    check_min <== min >= 0;
  }
}
EOS;

$html = <<<EOS
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


$layout = <<<EOS
view {
  number (label : "min", value : min);
  number (label : "value", value : value);
  number (label : "max", value : max);
  commandButton (label : "OK", value : result);
}
EOS;

?>

