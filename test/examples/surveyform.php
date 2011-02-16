<?php
// enablement/disablement example

$sheet = <<<EOS
sheet survey {

  interface: {
    q1;
    q2;
    q2_other: "";

    q3: [];
    q3_other : false;
    q3_other_text: "";
    
    q4_flag : false;
    q4_reason;
  }
  
  logic: {
  }

  output: {
    a1 <== q1;
    a2 <== (q1 == "true") ? empty : (q2 == "other") ? q2_other : q2;
    a3 <== (q1 == "false") ? empty : ((q3_other == false) ? q3 : q3.concat(q3_other_text));
    a4 <== (q1 == "true" && q4_flag == true) ? q4_reason : empty;
	
    result <== {answer1: a1, answer2: a2, answer3: a3, answer4: a4};
  }
  
  invariant: {
    // OK is enabled if q1 is Yes or (q1 is No and q2 is answered)
    must_be <== q1 != empty && ( q1 == "true" || (q2 != empty && (q2 != "other" || q2_other != "")));
  }
}

EOS;


$layout = <<<EOS

<style type="text/css">
#dialog { border: 1px solid black; padding: 1em; margin: 1em; }
#dialog label { display: block; }
</style>

<form id="dialog">
<label>1. Are you using online social networking services?</label>
<input type="radio" name="q1" id="q1" value="true">Yes</input>
<input type="radio" name="q1" value="false">No</input>
<br>

<br>

<label>2. If you answered No for the question 1, what is your reason?</label>
<input type="radio" name="q2" id="q2" value="privacy">Privacy Concern</input><br>
<input type="radio" name="q2" value="not_effective">Not effective for networking</input><br>
<input type="radio" name="q2" value="not_necessary">Not necessary</input><br>
<input type="radio" name="q2" value="other">Other</input>
<input type="text" id="q2_other"/><br>

<br>

<label>3. Which online social networking services are you using?</label>

<!-- binding multi-checkbox to a model variable -->
<input type="checkbox" name="q3" id="q3" value="Facebook">Facebook</input><br>
<input type="checkbox" name="q3" value="Twitter">Twitter</input><br>
<input type="checkbox" name="q3" value="MySpace">MySpace</input><br>
<input type="checkbox" name="q3" value="LinkedIn">LinkedIn</input><br>

<input type="checkbox" id="q3_other" value="Other">Other</input>
<input type="text" id="q3_other_text"/><br>
<br>

<label>4. Do you use Facebook? If yes, what is your favorite feature of Facebook?</label>
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

