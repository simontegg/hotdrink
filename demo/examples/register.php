<?php

$sheet = <<<EOS
sheet register {
  interface : {
    name : "";
    password1 : "";
    password2 : "";
  }
  output : {
    result <== { name : name, password : password1 };
  }
  invariant : {
    check_password <== password1 != "" && password1 == password2;
    check_name <== name != "";
  }
}
EOS;

$layout = <<<EOS
view {
  text (label : "Name", value : name);
  text (label : "Password", value : password1);
  text (label : "Re-enter password", value : password2);
  commandButton (label : "Register", value : result);
}
EOS;

?>
