<!-- user-defined functions -->
<script type="text/javascript">
function trim(str) {
    if(str == null) return null;
    return str.replace(/^\s*/, "").replace(/\s*$/, "");
}

/* zip to city is pseudo logic. It may utilize external web service API. */
// http://www.mongabay.com/igapo/zip_codes/index.htm
var zip_to_city_data = {
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
function zip_to_city(zip) {

    // don't invoke until 5 digits are given
    if(zip.length < 5) return null;
    if(!(zip in zip_to_city_data)) return null;

    // fire external invocation to get the mapping
    //return {state: zip_to_city_data[zip][0], city: zip_to_city_data[zip][1]};
    return zip_to_city_data[zip];
}
</script>


<?php

// how can I express that when state value has changed clear the city value?

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
    t1 <== (country == "US") ? zip_to_city(zip) : empty;
    relate {
        state, city <== (t1 == empty) ? [state, city] : t1;
    }
  }
  
  output: {
  // Better way to pass outputs (while considering enablement of widgets)?
    result <== (country == "US") ? { country: country, zip: zip, state: state, city: city, 
    street_address: [street_address1, street_address2], phone: phone }
    : (country == "CA") ? {country: country, province: province, zip: zip, city: city, street_address: [street_address1, street_address2], phone: phone }
    : {}
    ;
  }
  
  invariant: {
    not_empty <== state != "" && city != "" && street_address1 != "" && phone != "";
  }
}
EOS;

// * how can I make either state or province shown?
 
$layout = <<<EOS
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
		    <option value="">Select state</option>
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
            <option value="">Select province</option>
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
        <td><input type="text" id="phone"/> (Required)</td>
    </tr>
</table>
</fieldset>

<button type="button" id="result">OK</button>
</form>
EOS;

?>

