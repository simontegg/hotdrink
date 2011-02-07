<?php

// enablement/disablement example

// how to use boolean variable for button or select input?

$sheet = <<<EOS
sheet survey {

  interface: {
    q1;
    q2;
    q2_other: "";
    
    q3_facebook : false;
    q3_myspace : false;
    q3_twitter : false;
    q3_other : false;
    //q3 : {facebook: q3_facebook, myspace: q3_myspace, twitter: q3_twitter, other: q3_other};
    q3_other_text: "";
    
    q4_flag : false;
    q4_reason;
    
  }
  
  logic: {
    q3 <== {facebook: q3_facebook, myspace: q3_myspace, twitter: q3_twitter, other: q3_other};
  }

  output: {
    a1 <== q1;
    a2 <== (q1 == "true") ? empty : (q2 == "other") ? q2_other : q2;
    a3 <== (q1 == "false") ? empty : ((q3_other == true) ? [q3, q3_other_text] : [q3]);
    a4 <== (q4_flag == true) ? q4_reason : empty;
    result <== {answer1: a1, answer2: a2, answer3: a3, answer4: a4}; 
  }
  
  invariant: {
    must_be <== q1 != empty && ( q1 == "true" || (q2 != empty && (q2 != "other" || q2_other != "")));
    //must_be <== q1 != empty && ( q1 == "true" );
  }
}

EOS;


$layout = <<<EOS

<style type="text/css">
#dialog label { display: block; }
</style>

<form id="dialog">
<label>1. Are you using online social networking services?</label>
<!--
<input type="radio" name="q1" value="true">Yes</input>
<input type="radio" name="q1" value="false">No</input>
-->
<select id="q1">
  <option value="">Choose</option>
  <option value="true">Yes</option>
  <option value="false">No</option>
</select>
<br>

<br>

<label>2. If you do not use social networking services, what is your reason?</label>
<!--
<input type="radio" name="q2" value="privacy">Privacy Concern</input><br>
<input type="radio" name="q2" value="not_effective">Not effective for networking</input><br>
<input type="radio" name="q2" value="not_necessary">Not necessary</input><br>
<input type="radio" name="q2" value="other">Other</input>
-->
<select id="q2">
  <option value="">Choose</option>
  <option value="privacy">Privacy Concern</option>
  <option value="not_effective">Not effective for networking</option>
  <option value="not_necessary">Not necessary</option>
  <option value="other">Other</option>
</select>
<input type="text" id="q2_other"/><br>

<br>

<label>3. Which online social networking services are you using?</label>

<!-- how to group checkbox values into one variable? -->
<input type="checkbox" name="q3" id="q3_facebook">Facebook</input><br>
<input type="checkbox" name="q3" id="q3_myspace">MySpace</input><br>
<input type="checkbox" name="q3" id="q3_twitter">Twitter</input><br>
<input type="checkbox" name="q3" id="q3_other">Other</input>
<input type="text" id="q3_other_text"/><br>

<br>

<label>4. Do you use Facebook? What is your favorite feature of Facebook?</label>
<input type="checkbox" id="q4_flag">Yes</input>
<select id="q4_reason">
  <option value="">Choose</option>
  <option value="searching">Searching Friends</option>
  <option value="pictures">Sharing Pictures</option>
  <option value="status">Sharing Status</option>
  <option value="chat">Chatting</option>
</select>

<br>
<br>

<button type="button" id="result">OK</button>
</form>
EOS;

?>

