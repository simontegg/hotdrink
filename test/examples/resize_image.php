<?php
$sheet = <<<EOS
sheet image_resize {
  input: {
    initial_height  : 5 * 300;
    initial_width   : 7 * 300;
  }
  interface: {
    absolute_height : initial_height;
    absolute_width;
    relative_height;
    relative_width;
    preserve_ratio  : true;
  }
  logic: {
    /* Must do this until pre-processing of model and view declarations together
    is fully supported. */
    string_1 <== "Initial Height : " + initial_height;
    string_2 <== "Initial Width : " + initial_width;
    relate {
      absolute_width  <== relative_width * initial_width / 100;
      relative_width  <== absolute_width * 100 / initial_width;
    }
    relate {
      absolute_height <== relative_height * initial_height / 100;
      relative_height <== absolute_height * 100 / initial_height;
    }
    relate {
      relative_width  <== (preserve_ratio) ? (relative_height) : (relative_width);
      relative_height <== (preserve_ratio) ? (relative_width) : (relative_height);
    }
  }
  output: {
    result <== { height: absolute_height, width: absolute_width };
  }
}
EOS;

$layout = <<<EOS
<style type="text/css">
#ResizeImage { border: 1px solid black; padding: 1em; margin: 1em; }
#ResizeImage fieldset label { display: block; margin: .5em; }
</style>

<form id="ResizeImage">

<fieldset><legend>Height</legend>
<label>Initial : <span id="initial_height"></span></label>
<label>Absolute : <input type="text" id="absolute_height" /></label>
<label>Relative : <input type="text" id="relative_height" /></label>
</fieldset>

<fieldset><legend>Width</legend>
<label>Initial : <span id="initial_width"></span></label>
<label>Absolute : <input type="text" id="absolute_width" /></label>
<label>Relative : <input type="text" id="relative_width" /></label>
</fieldset>

<label>Constrain Image Proportions : <input type="checkbox" id="preserve_ratio" checked="true" /></label>
<br />
<button type="button" id="result" command="resize" >Resize</button>
</form>
EOS;

$layout_ast = <<<EOS
{
  type : "column",
  halign : "right",
  children : [
    {
      type : "row",
      valign : "center",
      children : [
        {
          type : "column",
          children : [
            {
              type : "string",
              value : "string_1"
            },
            {
              type : "number",
              label : "Absolute Height",
              value : "absolute_height"
            },
            {
              type : "number",
              label : "Relative Height",
              value : "relative_height"
            }
          ]
        },
        {
          type : "checkbox",
          label : "Preserve Proportions",
          value : "preserve_ratio"
        },
        {
          type : "column",
          children : [
            {
              type : "string",
              value : "string_2"
            },
            {
              type : "number",
              label : "Absolute Width",
              value : "absolute_width"
            },
            {
              type : "number",
              label : "Relative Width",
              value : "relative_width"
            }
          ]
        }
      ]
    },
    {
      type : "button",
      label : "Resize",
      command : {
        name : "resize",
        parameters : "result"
      }
    }
  ]
}
EOS;

?>

