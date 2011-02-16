<?php

/* Constant method is not evaluated because it never has relevant, changed
inputs. */
$sheet = <<<EOS
sheet alert_dialog
{
  output: {
    result <== { value: 50 };
  }
}
EOS;

$layout = <<<EOS
<form id="dialog">
<button type="button" id="result">Alert</button>
</form>
EOS;

?>
