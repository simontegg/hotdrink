<?php

$sheet = &$_POST["sheet"];
//$sheet_arg = escapeshellarg($sheet);

/* Prepare working directory. */
if (file_exists("tmp.output")) {
  $success = unlink("tmp.output");
  assert($success);
}

/* Parse. */
file_put_contents("tmp.adm", $sheet);
$report = shell_exec("./parse tmp.adm");

if (file_exists("tmp.output")) {
  print file_get_contents("tmp.output");
} else {
  print $report;
}

/* Cleanup working directory. */
assert(file_exists("tmp.adm"));
unlink("tmp.adm");
if (file_exists("tmp.output")) {
  unlink("tmp.output");
}

?>
