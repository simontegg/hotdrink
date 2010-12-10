<?php
$sheet = <<<EOS
sheet grouped_options
{
  interface: {
    all : false;
    boxes : [];
  }
    
  logic: {
    relate {
      all  <== boxes.size() == 3;
      boxes <== (all) ? (["A","B","C"]) : ([]);
    }
  }

  output: {
    result <== boxes;
  }
}
EOS;

$layout = <<<EOS
<style type="text/css">
#ResizeImage { border: 1px solid black; padding: 1em; margin: 1em; }
#ResizeImage fieldset label { display: block; margin: .5em; }
</style>

<form id="ResizeImage">

<fieldset><legend>Options</legend>
<label>All : <input type="checkbox" id="all" /></label>
<label>A : <input type="checkbox" id="boxes" name="boxes" value="A" /></label>
<label>B : <input type="checkbox" name="boxes" value="B" /></label>
<label>C : <input type="checkbox" name="boxes" value="C" /></label>
</fieldset>

<button type="button" id="result" command="show" >Command</button>

</form>
EOS;

?>

