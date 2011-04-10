<?php
$sheet = <<<EOS
sheet grouped_options
{
  interface: {
    all : false;
    a;
    b;
    c;
  }
    
  logic: {
    relate {
      all  <== a == b && b == c ? a : false;
      a, b, c <== [all, all, all];
    }
  }

  output: {
    result <== {a: a, b: b, c: c};
  }
}
EOS;

$cgraph = <<<EOS
{
  "variables": {
    "all": {"cell_type": "interface",
            "used_by": ["up", "down"],
            "initializer": "false"},
    "a": {"cell_type": "interface",
          "used_by": ["up", "down"]},
    "b": {"cell_type": "interface",
          "used_by": ["up", "down"]},
    "c": {"cell_type": "interface",
          "used_by": ["up", "down"]},
    "result": {"cell_type": "output",
               "used_by": ["out"]}
  },
  "methods": {
    "up": {"inputs": ["a", "b", "c"], "outputs": ["all"]},
    "down": {"inputs": ["all"], "outputs": ["a", "b", "c"]},
    "out": {"inputs": ["a", "b", "c"], "outputs": ["result"]}
  },
  "constraints": {
    "cn1": {"methods": ["up", "down"]},
    "cn2": {"methods": ["out"]}
  }
}
EOS;

$methods = <<<EOS
{
  down : function(E) {return [E.eval1("all"), E.eval1("all"), E.eval1("all")];},
  up : function(E) { return (E.eval1("a") == E.eval1("b") && E.eval1("b") == E.eval1("c")) ? (E.eval1("a")) : (false); },
  out : function(E) {return {a: E.eval1("a"), b: E.eval1("b"), c: E.eval1("c")};}
}
EOS;

$html = <<<EOS
<style type="text/css">
#ResizeImage { border: 1px solid black; padding: 1em; margin: 1em; }
#ResizeImage fieldset label { display: block; margin: .5em; }
</style>

<form id="ResizeImage">

<fieldset><legend>Options</legend>
<label>All : <input type="checkbox" id="all" /></label>
<label>A : <input type="checkbox" id="a" /></label>
<label>B : <input type="checkbox" id="b" /></label>
<label>C : <input type="checkbox" id="c" /></label>
</fieldset>

<button type="button" id="result" command="show" >Command</button>

</form>
EOS;

$trees = <<<EOS
[
  {
    "type" : "checkbox",
    "options" : {
      "label" : "All",
      "id" : "all",
      "bindValue" : "all"
    }
  },

  {
    "type" : "checkbox",
    "options" : {
      "label" : "A",
      "id" : "a",
      "bindValue" : "a"
    }
  },

  {
    "type" : "checkbox",
    "options" : {
      "label" : "B",
      "id" : "b",
      "bindValue" : "b"
    }
  },

  {
    "type" : "checkbox",
    "options" : {
      "label" : "C",
      "id" : "c",
      "bindValue" : "c"
    }
  },

  {
    "type" : "commandButton",
    "options" : {
      "label" : "Command",
      "id" : "result",
      "bindValue" : "result"
    }
  }
]
EOS;

?>

