<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" 
"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Sarge - Test</title>
<meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
<link type="text/css" rel="stylesheet" href="css/index.css" />
<link type="text/css" rel="stylesheet" href="css/context_menu.css" />
<link type="text/css" rel="stylesheet" href="css/pm.css" />
<script type="text/javascript" src="js/flapjax.js"></script>
<script type="text/javascript" src="js/flapjax_ext.js"></script>
<script type="text/javascript" src="js/prototype.js"></script>
<script type="text/javascript" src="js/hotdrink.js"></script>
<script type="text/javascript">
/* <![CDATA[ */

function loader() {
  /* Sources. */
  var sheetB = $B("sheet").calmB(1000);
  var layoutB = $B("layout").calmB(1000);
  liftB(hotdrink.open_dialog, sheetB, layoutB);
}

var select_page = function (elt) {
  //assert(elt.tagName.toLowerCase() === "select");
  var url = elt.options[elt.selectedIndex].readAttribute("value");
  if (url != null) {
    /* Redirect. */
    window.location=url;
  }
}

/* ]]> */
</script>
</head>
<body onload="loader();">
<script type="text/javascript" src="js/context_menu.js"></script>
<!--script type="text/javascript">enableDebug();</script-->
<div id="arrows"></div>
<div id="view"></div>
<div id="sources">
<?php
$examples = array(
    "addressform" => "Address form",
    "alert" => "Alert",
    "calculator" => "Calculator",
    "debug" => "Debug",
    "grouped_options" => "Grouped options",
    "hello" => "Hello",
    "minmax" => "Min-max",
    "preset" => "Preset",
    "resize_image" => "Resize image",
    "save_image" => "Save image",
    "screen" => "Screen",
    "surveyform" => "Survey form",
    "temperature" => "Temperature"
  );

$eg = null;
$sheet = "";
$layout = "";

if (array_key_exists("eg", $_GET)) {
  $eg = $_GET["eg"];
  if (array_key_exists($eg, $examples)) {
    include "examples/".$eg.".php";
    $eg_display_name = $examples[$eg];
    //echo "Loaded \"".$eg_display_name."\" example.<br />";
  } else {
    //echo "\"".$eg."\" example not found.<br />";
  }
} else {
  //echo "No example requested.<br />";
}

?>
  <label>Choose example: 
    <select onchange="select_page(this);">
      <option value="index.php" <?php echo ($eg == null) ? ("selected=\"selected\"") : ("") ?> >
      (none)
      </option>
<?php
foreach ($examples as $key => $value) {
  echo "<option value=\"index.php?eg=$key\"";
  if ($eg == $key) echo " selected=\"selected\"";
  echo ">\n";
  echo "$value\n";
  echo "</option>\n";
}
?>
    </select>
  </label>
  <label>Sheet
<textarea id="sheet" rows="24" cols="80">
<?php
echo htmlspecialchars($sheet);
?>
</textarea>
  </label>
  <label>Layout
<textarea id="layout" rows="24" cols="80">
<?php
echo htmlspecialchars($layout);
?>
</textarea>
  </label>
</div>
</body>
</html>

