<?php
$sheet = <<<EOS
sheet radio {
  interface : {
    theValue : "a";
  }
  output : {
    result <== theValue;
  }
}
EOS;


$layout = <<<EOS
<style type="text/css">
#dialog label { display: block; margin: .5em; }
</style>

<form id="dialog">
<fieldset>
<label>theValue :
  <input type="radio" id="theValue" name="theValueGroup" value="a" />A
  <input type="radio" name="theValueGroup" value="b" />B
</label>
</fieldset>
<button type="button" id="result">OK</button>
</form>
EOS;

?>

