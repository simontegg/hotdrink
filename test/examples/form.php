<?php

$sheet = <<<EOS
sheet form {
  interface : {
    line : "";
    paragraph : "";
    n : 0;
    check : false;
    checks : [];
    radio : "yes";
    dropdown : "one";
    one : "two";
    many : ["three", "four"];
  }

  output : {
    result <== {
      line : line,
      paragraph : paragraph,
      n : n,
      check : check,
      checks : checks,
      radio : radio,
      dropdown : dropdown,
      one : one,
      many : many
    };
  }
}
EOS;

$layout = <<<EOS
view {

  text (label : "Text", value : line);
  text (readonly, label : "Readonly text", value : "This is a string of text.");
  text (label : "Multi-line text", lines : 5, value : paragraph);
  number (label : "Number", units : "units", value : n);
  checkbox (label : "Checkbox", value : check);
  checkboxGroup (
    label : "Checkbox group",
    items : [
      { name : "one", value : 1 },
      { name : "two", value : 2 },
      { name : "three", value : 3 }
    ],
    value : checks);
  radioGroup (
    label : "Radio group",
    items : [
      { name : "Yes", value : "yes" },
      { name : "No", value : "no" }
    ],
    value : radio);
  dropdown (
    label : "Drop-down",
    items : [
      { name : "one", value : 1 },
      { name : "two", value : 2 },
      { name : "three", value : 3 },
      { name : "four", value : 4 },
      { name : "five", value : 5 },
      { name : "six", value : 6 }
    ],
    value : dropdown);
  selectOne (
    label : "Select one",
    size : 4,
    items : [
      { name : "one", value : 1 },
      { name : "two", value : 2 },
      { name : "three", value : 3 },
      { name : "four", value : 4 },
      { name : "five", value : 5 },
      { name : "six", value : 6 }
    ],
    value : one);
  selectMany (
    label : "Select many",
    size : 5,
    items : [
      { name : "one", value : 1 },
      { name : "two", value : 2 },
      { name : "three", value : 3 },
      { name : "four", value : 4 },
      { name : "five", value : 5 },
      { name : "six", value : 6 }
    ],
    value : many);
  commandButton (label : "OK", value : result);

}
EOS;

$trees = <<<EOS
[
  {
    "type" : "text",
    "options" : {
      "label" : "Text"
    }
  },

  {
    "type" : "text",
    "options" : {
      "label" : "Readonly text",
      "readonly" : true,
      "value" : "This is a string of text."
    }
  },

  {
    "type" : "text",
    "options" : {
      "label" : "Multi-line text",
      "lines" : 5
    }
  },

  {
    "type" : "number",
    "options" : {
      "label" : "Number",
      "units" : "units"
    }
  },

  {
    "type" : "checkbox",
    "options" : {
      "label" : "Checkbox"
    }
  },

  {
    "type" : "checkboxGroup",
    "options" : {
      "label" : "Checkbox group",
      "items" : [
        { "name" : "one", "value" : "1" },
        { "name" : "two", "value" : "2" },
        { "name" : "three", "value" : "3" }
      ]
    }
  },

  {
    "type" : "radioGroup",
    "options" : {
      "label" : "Radio group",
      "items" : [
        { "name" : "Yes", "value" : "yes" },
        { "name" : "No", "value" : "no" }
      ]
    }
  },

  {
    "type" : "dropdown",
    "options" : {
      "label" : "Drop-down",
      "items" : [
        { "name" : "one", "value" : 1 },
        { "name" : "two", "value" : 2 },
        { "name" : "three", "value" : 3 },
        { "name" : "four", "value" : 4 },
        { "name" : "five", "value" : 5 },
        { "name" : "six", "value" : 6 }
      ]
    }
  },

  {
    "type" : "selectOne",
    "options" : {
      "label" : "Select one",
      "size" : 4,
      "items" : [
        { "name" : "one", "value" : 1 },
        { "name" : "two", "value" : 2 },
        { "name" : "three", "value" : 3 },
        { "name" : "four", "value" : 4 },
        { "name" : "five", "value" : 5 },
        { "name" : "six", "value" : 6 }
      ]
    }
  },

  {
    "type" : "selectMany",
    "options" : {
      "label" : "Select many",
      "size" : 5,
      "items" : [
        { "name" : "one", "value" : 1 },
        { "name" : "two", "value" : 2 },
        { "name" : "three", "value" : 3 },
        { "name" : "four", "value" : 4 },
        { "name" : "five", "value" : 5 },
        { "name" : "six", "value" : 6 }
      ]
    }
  },

  {
    "type" : "commandButton",
    "options" : {
      "label" : "OK"
    }
  }
]
EOS;

?>
