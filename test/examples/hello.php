<?php
$sheet = <<<EOS
sheet dialog
{
  interface: {
    name;
  }
  
  constant: {
    greet_prefix : "Hello, ";
  }

  logic: {
    greeting <== greet_prefix + name;
  }
  
  output: { 
    result <== greeting;
  }
  
  invariant: {
    check_name <== name != empty && name != "";
  }
}
EOS;

$layout = <<<EOS
<style type="text/css">
#dialog label { display: block; margin: .5em; }
</style>

<form id="dialog">
<label>Name : <input type="text" id="name" /></label>
<button type="button" id="result">OK</button>
</form>
EOS;

?>

