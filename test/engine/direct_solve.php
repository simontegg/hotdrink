<?php

$cgraph = &$_POST["cgraph"];
$priority = &$_POST["priority"];
$cgraph_arg = escapeshellarg($cgraph);
$priority_arg = escapeshellarg($priority);
print `./solve $cgraph_arg $priority_arg`;

?>
