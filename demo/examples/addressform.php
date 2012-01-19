<!-- user-defined functions -->
<script type="text/javascript">
function trim(str) {
    if(str == null) return null;
    return str.replace(/^\s*/, "").replace(/\s*$/, "");
}

/* zip to city is pseudo logic. It may utilize external web service API. */
// http://www.mongabay.com/igapo/zip_codes/index.htm
var us_zip_to_city_data = {
    10001: ["NY", "New York"],
    73301: ["TX", "Austin"],
    77001: ["TX", "Houston"],
    77840: ["TX", "College Station"],
    77841: ["TX", "College Station"],
    77842: ["TX", "College Station"],
    77843: ["TX", "College Station"],
    77844: ["TX", "College Station"],
    77845: ["TX", "College Station"],
    94101: ["CA", "San Francisco"],
    94301: ["CA", "Palo Alto"],
    95101: ["CA", "San Jose"]
};

//zip_to_city is expensive function(due to outgoing call)
function us_zip_to_city(zip) {
  // don't invoke until 5 digits are given
  if(zip.length < 5) return [null,null];
  if(!(zip in us_zip_to_city_data)) return [null,null];

  // fire external invocation to get the mapping
  //return {state: zip_to_city_data[zip][0], city: zip_to_city_data[zip][1]};
  return us_zip_to_city_data[zip];
}

function ca_zip_to_city(zip) {
  // dummy for now
  return [null,null];
}
</script>


<?php

// how can I express that when state value has changed clear the city value?
// how to avoid duplicate typing in output?

$sheet = <<<EOS
sheet address
{
  interface: {
    country : "US";
    zip: "";
    state: "";
    province;
    city: "";
    street_address1: "";
    street_address2: "";
    phone: "";
  }
  
  logic: {
    is_us <== country == "US";
    is_ca <== country == "CA";

    us_state, us_city <== is_us ? us_zip_to_city(zip) : [empty, empty];
    ca_province, ca_city <== is_ca ? ca_zip_to_city(zip) : [empty, empty];
    
    relate {
      // map zip to state
      // clear state if not US
      state <== is_us ? (us_state != empty ? us_state : state) : "";
    }
    relate {
      // map zip to province
      // clear province if not CA
      province <== is_ca ? (ca_province != empty ? ca_province : province) : "";
    }
    relate {
      // map zip to city  
      city <== is_us ? (us_city != empty ? us_city : city) : 
          (is_ca ? (ca_city != empty ? ca_city : city) : city);
    }
  }
  
  output: {
    result <== is_us ? 
      { country: country, zip: zip, state: state, city: city, street_address: [street_address1, street_address2], phone: phone }
      : (is_ca ? 
        {country: country, province: province, zip: zip, city: city, street_address: [street_address1, street_address2], phone: phone }
        : {});
  }
  
  invariant: {
    invariant1 <== state != "" || province != ""; 
    invariant2 <== city != "";
    invariant3 <== street_address1 != "";
    invariant4 <== phone != "";
  }
}
EOS;

// * how can I make either state or province displayed?
 
$html = <<<EOS
<style type="text/css">
</style>

<form id="form">
<fieldset><legend>Address</legend>
<table>
    <tr>
        <td><label>Country :</label></td>
        <td><select id="country">
            <option value="US">United States</option>
            <option value="CA">Canada</option>
        </select></td>
    </tr>
    <tr>
        <td><label>ZIP Code :</label></td>
        <td><input type="text" id="zip" /></td>
    </tr>
    <tr>
        <td><label>State :</label></td>
        <td><select id="state">
		    <option value="">Select State</option>
		    <option value="AL">Alabama</option>
		    <option value="AK">Alaska</option>
		    <option value="AZ">Arizona</option>
		    <option value="AR">Arkansas</option>
		    <option value="CA">California</option>
		    <option value="CO">Colorado</option>
		    <option value="CT">Connecticut</option>
		    <option value="DE">Delaware</option>
		    <option value="DC">District Of Columbia</option>
		    <option value="FL">Florida</option>
		    <option value="GA">Georgia</option>
		    <option value="HI">Hawaii</option>
		    <option value="ID">Idaho</option>
		    <option value="IL">Illinois</option>
		    <option value="IN">Indiana</option>
		    <option value="IA">Iowa</option>
		    <option value="KS">Kansas</option>
		    <option value="KY">Kentucky</option>
		    <option value="LA">Louisiana</option>
		    <option value="ME">Maine</option>
		    <option value="MD">Maryland</option>
		    <option value="MA">Massachusetts</option>
		    <option value="MI">Michigan</option>
		    <option value="MN">Minnesota</option>
		    <option value="MS">Mississippi</option>
		    <option value="MO">Missouri</option>
		    <option value="MT">Montana</option>
		    <option value="NE">Nebraska</option>
		    <option value="NV">Nevada</option>
		    <option value="NH">New Hampshire</option>
		    <option value="NJ">New Jersey</option>
		    <option value="NM">New Mexico</option>
		    <option value="NY">New York</option>
		    <option value="NC">North Carolina</option>
		    <option value="ND">North Dakota</option>
		    <option value="OH">Ohio</option>
		    <option value="OK">Oklahoma</option>
		    <option value="OR">Oregon</option>
		    <option value="PA">Pennsylvania</option>
		    <option value="RI">Rhode Island</option>
		    <option value="SC">South Carolina</option>
		    <option value="SD">South Dakota</option>
		    <option value="TN">Tennessee</option>
		    <option value="TX">Texas</option>
		    <option value="UT">Utah</option>
		    <option value="VT">Vermont</option>
		    <option value="VA">Virginia</option>
		    <option value="WA">Washington</option>
		    <option value="WV">West Virginia</option>
		    <option value="WI">Wisconsin</option>
		    <option value="WY">Wyoming</option>
        </select> (Required)</td>
    </tr>
    <tr>
        <td><label>Province :</label></td>
        <td><select id="province">
            <option value="">Select Province</option>
            <option value="AB">Alberta</option>
            <option value="BC">British Columbia</option>
            <option value="MB">Manitoba</option>
            <option value="NB">New Brunswick</option>
            <option value="NL">Newfoundland and Labrador</option>
            <option value="NS">Nova Scotia</option>
            <option value="NU">Nunavut</option>
            <option value="NT">Northwest Territories</option>
            <option value="ON">Ontario</option>
            <option value="PE">Prince Edward Island</option>
            <option value="QC">Quebec</option>
            <option value="SK">Saskatchewan</option>
            <option value="YT">Yukon</option>
        </select></td>
    </tr>
    <tr>
        <td><label>City :</label></td>
        <td><input type="text" id="city"/> (Required)</td>
    </tr>
    <tr>
        <td><label>Address 1 :</label></td>
        <td><input type="text" id="street_address1"/> (Required)</td>
    </tr>
    <tr>
        <td><label>Address 2 :</label></td>
        <td><input type="text" id="street_address2"/></td>
    </tr>
    <tr>
        <td><label>Phone :</label></td>
        <td><input type="text" id="phone1" size=3/>-<input type="text" id="phone2" size=4/>-<input type="text" id="phone3" size=4/> (Required)</td>
    </tr>
</table>
</fieldset>

<button type="button" id="result">OK</button>
</form>
EOS;

$layout = <<<EOS
view {
  dropdown (
    label : "Country",
    items : [
      { name : "United States", value : "US"},
      { name : "Canada", value : "CA"}
    ],
    value : country
  );
  text (label : "Zip Code", value : zip);
  dropdown (
    label : "State",
    items : [
	    { name : "Select State", value : "" },
	    { name : "Alabama", value : "AL" },
	    { name : "Alaska", value : "AK" },
	    { name : "Arizona", value : "AZ" },
	    { name : "Arkansas", value : "AR" },
	    { name : "California", value : "CA" },
	    { name : "Colorado", value : "CO" },
	    { name : "Connecticut", value : "CT" },
	    { name : "Delaware", value : "DE" },
	    { name : "District Of Columbia", value : "DC" },
	    { name : "Florida", value : "FL" },
	    { name : "Georgia", value : "GA" },
	    { name : "Hawaii", value : "HI" },
	    { name : "Idaho", value : "ID" },
	    { name : "Illinois", value : "IL" },
	    { name : "Indiana", value : "IN" },
	    { name : "Iowa", value : "IA" },
	    { name : "Kansas", value : "KS" },
	    { name : "Kentucky", value : "KY" },
	    { name : "Louisiana", value : "LA" },
	    { name : "Maine", value : "ME" },
	    { name : "Maryland", value : "MD" },
	    { name : "Massachusetts", value : "MA" },
	    { name : "Michigan", value : "MI" },
	    { name : "Minnesota", value : "MN" },
	    { name : "Mississippi", value : "MS" },
	    { name : "Missouri", value : "MO" },
	    { name : "Montana", value : "MT" },
	    { name : "Nebraska", value : "NE" },
	    { name : "Nevada", value : "NV" },
	    { name : "New Hampshire", value : "NH" },
	    { name : "New Jersey", value : "NJ" },
	    { name : "New Mexico", value : "NM" },
	    { name : "New York", value : "NY" },
	    { name : "North Carolina", value : "NC" },
	    { name : "North Dakota", value : "ND" },
	    { name : "Ohio", value : "OH" },
	    { name : "Oklahoma", value : "OK" },
	    { name : "Oregon", value : "OR" },
	    { name : "Pennsylvania", value : "PA" },
	    { name : "Rhode Island", value : "RI" },
	    { name : "South Carolina", value : "SC" },
	    { name : "South Dakota", value : "SD" },
	    { name : "Tennessee", value : "TN" },
	    { name : "Texas", value : "TX" },
	    { name : "Utah", value : "UT" },
	    { name : "Vermont", value : "VT" },
	    { name : "Virginia", value : "VA" },
	    { name : "Washington", value : "WA" },
	    { name : "West Virginia", value : "WV" },
	    { name : "Wisconsin", value : "WI" },
	    { name : "Wyoming", value : "WY" }
    ],
    value : state
  );
  dropdown (
    label : "Province",
    items : [
      { name : "Select Province", value : "" },
      { name : "Alberta", value : "AB" },
      { name : "British Columbia", value : "BC" },
      { name : "Manitoba", value : "MB" },
      { name : "New Brunswick", value : "NB" },
      { name : "Newfoundland and Labrador", value : "NL" },
      { name : "Nova Scotia", value : "NS" },
      { name : "Nunavut", value : "NU" },
      { name : "Northwest Territories", value : "NT" },
      { name : "Ontario", value : "ON" },
      { name : "Prince Edward Island", value : "PE" },
      { name : "Quebec", value : "QC" },
      { name : "Saskatchewan", value : "SK" },
      { name : "Yukon", value : "YT" }
    ],
    value : province
  );
  text (label : "City", value : city);
  text (label : "Address Line 1", value : street_address1);
  text (label : "Address Line 2", value : street_address2);
  text (label : "Phone", value : phone);
  commandButton (label : "OK", value : result);
}
EOS;

?>
