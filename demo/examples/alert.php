<?php

$sheet = <<<EOS
sheet alert_dialog
{
  output: {
    result <== "Hello World!";
  }
}
EOS;

$layout = <<<EOS
view {
  commandButton (label : "Press Me", value : result);
}
EOS;
?>
