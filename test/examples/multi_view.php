<?php

$sheet = <<<EOS
sheet test {
  interface: {
    x : true;
    a : false; // single checkbox
    b : []; // multiple checkbox
    c : "yes"; // radio
  }
  output:{
    result <== (x == false) ? "nothing" : {a:a, b:b, c:c};
  }
}
EOS;

$layout = <<<EOS
<style type="text/css">
#form { border: 1px solid black; padding: 1em; margin: 1em; }
#form label { display: block; }
</style>

<form id="form">
<label>X : <input type="checkbox" id="x"> Enable/Disable all below</input>
<label>A : <input type="checkbox" id="a"></input>
<label>B-1 : <input type="checkbox" id="b" name="b" value="1" /></label>
<label>B-2 : <input type="checkbox" name="b" value="2" /></label>
<label>B-3 : <input type="checkbox" name="b" value="3" /></label>
<label>C : <input type="radio" name="c" value="yes" />Yes <input type="radio" name="c" value="no" />No</label>

<button type="button" id="result">OK</button>
</form>
EOS;

?>
