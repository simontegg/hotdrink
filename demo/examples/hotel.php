<script type="text/javascript">

function add_days(d, n) {
  var dp = new Date(d);
  dp.setDate(dp.getDate() + parseInt(n));
  return dp.getFullYear() + "/" + (dp.getMonth()+1) + "/" + dp.getDate();
}

function remove_days(d, n) {
  return add_days(d, -parseInt(n));
}

function day_difference(d1, d2) {
  var t2 = new Date(d2).getTime();
  var t1 = new Date(d1).getTime();
  var ms_in_day = 1000*3600*24;
  return parseInt((t2-t1)/ms_in_day + 0.5);
}
</script>

<?php

$sheet = <<<EOS
sheet hotel {
  interface: {
    checkin: "2011/1/1";
    nights: 1;
    checkout;
  }
  logic: {
    relate {
      checkout <== add_days(checkin, nights);
      checkin <== remove_days(checkout, nights);
      nights <== day_difference(checkin, checkout);
    }
  }

  invariant: {
    at_least_one_night <== nights > 0;
  } 

  output: {
    hotelresult <== { checkin: checkin, checkout: checkout };
  } 
}
EOS;

$layout = <<<EOS
view {
  text (label : "Check in", value : checkin);
  text (label : "Check out", value : checkout);
  text (label : "Nights", value : nights);
  
  row {
    commandButton (label : "Cancel");
    commandButton (label : "Ok", value : hotelresult);
  }
}
EOS;
?>
