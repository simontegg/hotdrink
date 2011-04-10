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

$html = <<<EOS
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

$trees = <<<EOS
[

  {
    "type" : "row",
    "options" : {},
    "children" : [
      {
        "type" : "column",
        "options" : {},
        "children" : [
          {
            "type" : "number",
            "options" : {
              "readonly" : true,
              "label" : "Initial width",
              "units" : "px",
              "id" : "initial_width",
              "bindValue" : "initial_width"
            }
          },

          {
            "type" : "number",
            "options" : {
              "label" : "Absolute width",
              "units" : "px",
              "id" : "absolute_width",
              "bindValue" : "absolute_width"
            }
          },

          {
            "type" : "number",
            "options" : {
              "label" : "Relative width",
              "units" : "%",
              "id" : "relative_width",
              "bindValue" : "relative_width"
            }
          }
        ]
      },

      {
        "type" : "column",
        "options" : {},
        "children" : [
          {
            "type" : "number",
            "options" : {
              "readonly" : true,
              "label" : "Initial height",
              "units" : "px",
              "id" : "initial_height",
              "bindValue" : "initial_height"
            }
          },

          {
            "type" : "number",
            "options" : {
              "label" : "Absolute height",
              "units" : "px",
              "id" : "absolute_height",
              "bindValue" : "absolute_height"
            }
          },

          {
            "type" : "number",
            "options" : {
              "label" : "Relative height",
              "units" : "%",
              "id" : "relative_height",
              "bindValue" : "relative_height"
            }
          }
        ]
      }
    ]
  },

  {
    "type" : "row",
    "options" : {},
    "children" : [
      {
        "type" : "checkbox",
        "options" : {
          "label" : "Preserve proportions",
          "id" : "preserve_ratio",
          "bindValue" : "preserve_ratio"
        }
      }
    ]
  },

  {
    "type" : "row",
    "options" : {},
    "children" : [
      {
        "type" : "commandButton",
        "options" : {
          "label" : "Resize",
          "id" : "result",
          "bindValue" : "result"
        }
      }
    ]
  }

]
EOS;

?>

