<?php
// enablement/disablement of widgets
// command activation based on invariants

$sheet = <<<EOS
sheet survey {

  interface: {
    q1: empty; //"true" or "false" TODO: --> boolean value
    q2; //string
    q2_other: "";

    q3: []; //array of string
    q3_other : "";
    
    q4 : false;
    q4_reason : "";
  }
  
  logic: {
    a1 <== (q1 == "true") ? true : false;
    a2 <== (q1 == empty || q1 == "true") ? empty : {code: q2, other: (q2 == "other") ? q2_other : empty};
    a3 <== (q1 == empty || q1 == "false") ? empty : {list: q3, other: contains(q3, "other") ? q3_other : empty};
    a4 <== (q1 == empty || q1 == "false") ? empty : (q4 ? q4_reason : empty);
  }

  output: {
    result <== {a1: a1, a2: a2, a3: a3, a4: a4};
  }
  
  invariant: {
    // invariants are used to validate the form values
    // for demonstration, the result will be used deactivate submit button
    invariant1 <== q1 != empty;
    invariant2 <== q1 == "true" || (q2 != empty && (q2 != "other" || q2_other != ""));
    invariant4 <== !q4 || q4_reason != "";
  }
}

EOS;


$layout = <<<EOS
view {
  row {
    text (readonly, value : "1. Are you using online social networking services?");
  }
  row {
    radioGroup (
      items : [
        { name : "Yes", value : "true" },
        { name : "No", value : "false" }
      ],
      value : q1
    );
  }
  
  row {
    text (readonly, value : "2. If you answered No for the question 1, what is your reason?");
  }
  row {
    radioGroup (
      items : [
        { name : "Privacy Concern", value : "privacy" },
        { name : "Not effective for networking", value : "not_effective" },
        { name : "Not necessary to me", value : "not_necessary"},
        { name : "Other (please specify)", value : "other"}
      ],
      value : q2
    );
  }
  row {
    //TODO put this after Other button
    text (value : q2_other);
  }
  
  row {
    text (readonly, value : "3. Which online social networking services are you using?");
  }
  row {
    checkboxGroup (
    	items : [
    	  { name : "Facebook", value : "facebook" },
    	  { name : "Twitter", value : "twitter" },
    	  { name : "MySpace", value : "myspace" },
    	  { name : "LinkedIn", value : "linkedin" },
    	  { name : "Other", value : "other" }
    	],
    	value : q3
    );
  }
  row {
    text (value : q3_other);
  }
  
  row {
    text (readonly, value : "4. Do you use Facebook? If yes, what is your favorite feature of Facebook?");
  }
  row {
    //TODO put label "Yes" after the checkbox
    checkbox (name : "Yes", value : q4);
    dropdown (
      items : [
        { name : "Choose One", value : ""},
        { name : "Searching Friends", value : "search"},
        { name : "Sharing Pictures", value : "picture"},
        { name : "Sharing Status", value : "status"},
        { name : "Chatting", value : "chat"}
      ],
      value : q4_reason
    );
  }
  
  commandButton(label : "Submit", value : result);
}
EOS;

?>

