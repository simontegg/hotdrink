<?php

$sheet = <<<EOS
sheet form {
}
EOS;

$html = <<<EOS
text (label : "Text");
text (readonly, label : "Readonly text", value : "This is a string of text.");
text (label : "Multi-line text", lines : 5);
number (label : "Number", units : "units");
checkbox (label : "Checkbox");
checkboxGroup (
  label : "Checkbox group,
  items : [
    { name : "one", value : 1 },
    { name : "two", value : 2 },
    { name : "three", value : 3 }
  ]);
radioGroup (
  label : "Radio group",
  items : [
    { "name" : "Yes", "value" : "yes" },
    { "name" : "No", "value" : "no" }
  ]);
dropdown (
  label : "Drop-down",
  items : [
    { "name" : "one", "value" : 1 },
    { "name" : "two", "value" : 2 },
    { "name" : "three", "value" : 3 },
    { "name" : "four", "value" : 4 },
    { "name" : "five", "value" : 5 },
    { "name" : "six", "value" : 6 }
  ]);
selectOne (
  label : "Select one",
  size : 4,
  items : [
    { "name" : "one", "value" : 1 },
    { "name" : "two", "value" : 2 },
    { "name" : "three", "value" : 3 },
    { "name" : "four", "value" : 4 },
    { "name" : "five", "value" : 5 },
    { "name" : "six", "value" : 6 }
  ]);
selectMany (
  label : "Select many",
  size : 5,
  items : [
    { "name" : "one", "value" : 1 },
    { "name" : "two", "value" : 2 },
    { "name" : "three", "value" : 3 },
    { "name" : "four", "value" : 4 },
    { "name" : "five", "value" : 5 },
    { "name" : "six", "value" : 6 }
  ]);
commandButton (label : "OK");
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
