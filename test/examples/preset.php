<?php
$sheet = <<<EOS
sheet preset {
  constant : {
    preset_data : [ 
    {string_value: "Preset One", number_value: 1},
    {string_value: "Preset Two", number_value: 2},
    {string_value: "Preset Three", number_value: 3}
    ];
  }

  interface: {
    preset : 0;
    string_value;
    number_value;
  }
  
  logic: {
    relate {
      string_value, number_value <== preset == 100 ? ["",""] : [preset_data[preset].string_value, preset_data[preset].number_value];
      preset <== (string_value == preset_data[preset].string_value && number_value == preset_data[preset].number_value) ? preset : 100;
    }
  }

  output: {
    result <== { string_value: string_value, number_value: number_value };
  }
}

EOS;


$layout = <<<EOS

<style type="text/css">
#dialog label { display: block; margin: .5em; }
</style>

<form id="dialog">
<fieldset>
<legend>Preset Example</legend>
<label>Preset :
<select id="preset">
  <!-- TODO: HOW TO GENERATE THIS FROM MODEL? -->
  <option value="0">Preset One</option>
  <option value="1">Preset Two</option>
  <option value="2">Preset Three</option>
  <option value="100">User defined</option>
</select>
</label>
<label>String Value : <input type="text" id="string_value" /></label>
<label>Number Value : <input type="text" id="number_value" /></label>
</fieldset>
<button type="button" id="result">OK</button>
</form>
EOS;

?>

