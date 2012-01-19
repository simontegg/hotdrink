<?php

/* For simple POST request forwarding. */
function http_post($url, $data) {
 if (is_array($data)) $data = http_build_query($data);
 $ch = curl_init();
 curl_setopt($ch, CURLOPT_URL, $url);
 curl_setopt($ch, CURLOPT_POST, true);
 curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
 $result =  curl_exec($ch);
 curl_close($ch);
 if($result === NULL) {
   throw new Exception('curl request error ('.curl_errno($curlInterface).'): '.curl_error($curlInterface));
 } else {
   return $result;
 }
}

echo http_post('http://leela.cs.tamu.edu/pm/engine/parse.php', $_POST);

?>
