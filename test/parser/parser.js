(function() {

  module("parser-basic", {
	  setup: function() {
		  var adam =
			  ['sheet circle {',
			   '	interface: {',
			   '		radius: 10;',
			   '		diameter;',
			   '	}',
			   '	logic: {',
			   '		relate {',
			   '			radius <== diameter / 2;',
			   '			diameter <== radius * 2;',
			   '		}',
			   '	}',
			   '	output: {',
			   '		result <== radius;',
			   '	}',
			   '}'
			  ].join('\n');
		  this.result = hotdrink.parser.ModelParser.parse(adam);
	  }
  });

	function classifyMethods(methodMap) {
    var methodTypes = {invalid: [], extra: [], d2r: [], r2d: [], r2r: []};
	  for (var methodId in methodMap) {
		  var method = methodMap[methodId];
		  if (method.inputs == undefined || method.outputs == undefined) {
        methodTypes.invalid.push(methodId);
		  }
		  else if (method.inputs.length == 1 && method.inputs[0] == "diameter" &&
				       method.outputs.length == 1 && method.outputs[0] == "radius"		) {
        methodTypes.d2r.push(methodId);
		  }
		  else if (method.inputs.length == 1 && method.inputs[0] == "radius" &&
				       method.outputs.length == 1 && method.outputs[0] == "diameter"		) {
        methodTypes.r2d.push(methodId);
		  }
		  else if (method.inputs.length == 1 && method.inputs[0] == "radius" &&
				       method.outputs.length == 1 && method.outputs[0] == "result"		) {
        methodTypes.r2r.push(methodId);
		  }
		  else {
        methodTypes.extra.push(methodId);
		  }
    }
    return methodTypes;
  }

  test("parse function", function() {
	  ok(this.result != undefined, "parse function should return value");
	  ok(this.result.cgraph != undefined, "parse function return value should contain cgraph");
	  ok(this.result.methods != undefined, "parse function return value should contain methods");
  });

  test("cgraph variables", function() {
	  var cgraph = this.result.cgraph;
	  ok(cgraph.variables != undefined, "cgraph should contain variables map");
	  equal(Object.keys(cgraph.variables).length, 3, "variables map should contain 3 variables");
	  var radius = cgraph.variables.radius;
	  ok(radius != undefined, "variable map should include radius");
	  equal(radius.cellType, "interface", "radius variable should be interface type");
	  ok(radius.usedBy != undefined, "radius variable should have a usedBy array");
	  var diameter = cgraph.variables.diameter;
	  ok(diameter != undefined, "variable map should include diameter");
	  equal(diameter.cellType, "interface", "diameter variable should be interface type");
	  ok(diameter.usedBy != undefined, "diameter variable should have a usedBy array");
	  var result = cgraph.variables.result;
	  ok(result != undefined, "varaible map should include result");
	  equal(result.cellType, "output", "result variable should be interface type");
	  ok(result.usedBy != undefined, "result variable should have a usedBy array");
  });

  test("cgraph methods", function() {
	  var cgraph = this.result.cgraph;
	  ok(cgraph.methods != undefined, "cgraph should contain methods map");

    var methodTypes = classifyMethods(cgraph.methods);

	  equal(methodTypes.invalid.length, 0, "there should be no methods without inputs or outputs array");
	  equal(methodTypes.d2r.length, 1, "there should be exactly one method for diameter ==> radius");
	  equal(methodTypes.r2d.length, 1, "there should be exactly one method for radius ==> diameter");
	  equal(methodTypes.r2r.length, 1, "there should be exactly one method for radius ==> result");
	  equal(methodTypes.extra.length, 0, "there should be no methods other than the three expected");

	  var diameter = cgraph.variables.diameter;
	  ok(diameter.usedBy.length == 1 && diameter.usedBy[0] == methodTypes.d2r[0],
		   "diameter variable should be usedBy diameter ==> radius method");
	  var radius = cgraph.variables.radius;
	  ok(radius.usedBy.length == 2 &&
		   ((radius.usedBy[0] == methodTypes.r2d[0] && radius.usedBy[1] == methodTypes.r2r[0]) ||
			  (radius.usedBy[0] == methodTypes.r2r[0] && radius.usedBy[1] == methodTypes.r2d[0])	 ),
		   "radius variable should be usedBy radius ==> diameter && radius ==> result methods")
	  var result = cgraph.variables.result;
	  ok(result.usedBy.length == 0, "result variable should not be usedBy any methods");
  });

  test("cgraph constraints", function() {
	  var cgraph = this.result.cgraph;
	  ok(cgraph.constraints != undefined, "cgraph should contain constraint map");

	  equal(Object.keys(cgraph.constraints).length, 2, "cgraph should have 2 constraints");

    var methodTypes = classifyMethods(cgraph.methods);

    var constraintTypes = {invalid: [], extra: [], logic: [], output: []};
    for (var constraintId in cgraph.constraints) {
      var constraint = cgraph.constraints[constraintId];
      if (constraint.methods == undefined) {
        constraintTypes.invalid.push(constraintId);
      }
      else if (constraint.methods.length == 2 &&
               ((constraint.methods[0] == methodTypes.d2r[0] && constraint.methods[1] == methodTypes.r2d[0]) ||
                (constraint.methods[0] == methodTypes.r2d[0] && constraint.methods[1] == methodTypes.d2r[0]))) {
        constraintTypes.logic.push(constraintId);
      }
      else if (constraint.methods.length == 1 &&
               constraint.methods[0] == methodTypes.r2r[0]) {
        constraintTypes.output.push(constraintId);
      }
      else {
        constraintTypes.extra.push(constraintId);
      }
    }

    equal(constraintTypes.invalid.length, 0, "there should be no constraints without a method list");
    equal(constraintTypes.logic.length, 1, "there should be exactly one constraint for radius <==> diameter");
    equal(constraintTypes.output.length, 1, "there should be exactly one constraint for radius ==> result");
    equal(constraintTypes.extra.length, 0, "there should be no constraints other than the two expected");
  });

})();