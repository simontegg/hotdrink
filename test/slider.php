<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" 
"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Hotdrink - Test</title>
<meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
<link type="text/css" rel="stylesheet" href="css/index.css" />
<link type="text/css" rel="stylesheet" href="css/eve.css" />
<link type="text/css" rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/dojo/1.6/dijit/themes/claro/claro.css">
<script type="text/javascript" src="js/flapjax.js"></script>
<script type="text/javascript" src="js/flapjax_ext.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/dojo/1.6.1/dojo/dojo.xd.js"></script>
<script type="text/javascript" src="js/prototype.js"></script>
<script type="text/javascript" src="js/hotdrink.js"></script>
<script type="text/javascript">
/* <![CDATA[ */

function loader() {
  /* Sources. */
  var sheetB = $B("sheet").calmB(1000);
  var layoutB = $B("layout").calmB(1000);

  /* Library call. */
  liftB(function (sheet, layout) {
    if (sheet === "") {
      sheet = "sheet {}";
    }
    if (layout === "") {
      layout = "view {}";
    }
    hotdrink.openDialog({
      adam : sheet,
      eve : layout,
      builders : hotdrink.controller.view.dijit.builders,
      onCommand : function (data) {
                    alert("You synthesized these parameters:\n"
                          + Object.toJSON(data));
                  }
    });
  }, sheetB, layoutB);
}

dojo.ready(loader);

/* ]]> */
</script>
</head>
<body class="claro">
<!--script type="text/javascript">enableDebug();</script-->
<div id="view_container">
<div id="view"></div>
</div>

<div id="sources">
  <label>Sheet
<textarea id="sheet">
sheet dialog
{

// ISSUES
// 1. while changing the value of max, it affects other values too soon. 
//    e.g. when 200 is typed for max the 'value' will change instantly to be 2 

  interface: {
    value: 50;
    min: 0;
    max: 100;
  }

  logic: {
    relate {
      value <== value > min ? value : min;
      min <== value < min ? value : min;
    }
    relate {
      value <== value < max ? value : max;
      max <== value > max ? value : max;
    }
  }
  
  output: { 
    result <== { value: value, min: min, max: max };
  }
  
  invariant: {
    check_min <== min >= 0;
  }
}
</textarea>
  </label>
  <label>Layout
<textarea id="layout">
view {
  slider (label : "value", value : value, minimum : min, maximum : max);
  number (label : "min", value : min);
  number (label : "value", value : value);
  number (label : "max", value : max);
  commandButton (label : "OK", value : result);
}
</textarea>
  </label>
</div>
</body>
</html>

