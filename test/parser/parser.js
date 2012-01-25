(function() {

  /**
   * Module definition
   */
  module("parser-basic", {
	  setup: function() {
		  this.result = hotdrink.parser.ModelParser.parse(hottest.circle.adam);
	  }
  });

  /**
   * Sort through expected methods and decide which is which.
   */
	function classifyMethods(methodMap) {
    var methodTypes = {invalid: [], extra: [], d2r: [], r2d: [], a2r: []};
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
		  else if (method.inputs.length == 2
               && (   (method.inputs[0] == "radius"
                       && method.inputs[1] == "pi")
                   || (method.inputs[0] == "pi"
                       && method.inputs[1] == "radius"))
				       && method.outputs.length == 1 && method.outputs[0] == "result") {
        methodTypes.a2r.push(methodId);
		  }
		  else {
        methodTypes.extra.push(methodId);
		  }
    }
    return methodTypes;
  }

  /**
   * Test that parse function works and has return value.
   */
  test("parse function", function() {
	  ok(this.result != undefined,
       "parse function should return value");
	  ok(this.result.cgraph != undefined,
       "parse function return value should contain cgraph");
	  ok(this.result.methods != undefined,
       "parse function return value should contain methods");
  });

  /**
   * Check the variable nodes found in the CGraph.
   */
  test("cgraph variables", function() {
	  var cgraph = this.result.cgraph;
	  ok(cgraph.variables != undefined,
       "cgraph should contain variables map");
	  equal(Object.keys(cgraph.variables).length, 4,
          "variables map should contain 4 variables");

	  var radius = cgraph.variables.radius;
	  ok(radius != undefined,
       "variable map should include radius");
	  equal(radius.cellType, "input",
          "radius variable should be input type");
	  ok(radius.usedBy != undefined,
       "radius variable should have a usedBy array");

	  var diameter = cgraph.variables.diameter;
	  ok(diameter != undefined,
       "variable map should include diameter");
	  equal(diameter.cellType, "interface",
          "diameter variable should be interface type");
	  ok(diameter.usedBy != undefined,
       "diameter variable should have a usedBy array");

	  var result = cgraph.variables.result;
	  ok(result != undefined,
       "varaible map should include result");
	  equal(result.cellType, "output",
          "result variable should be interface type");
	  ok(result.usedBy != undefined,
       "result variable should have a usedBy array");

    var pi = cgraph.variables.pi;
    ok(pi != undefined,
       "variable map should include pi");
    equal(pi.cellType, "constant",
          "pi variable should be constant type");
    equal(pi.initializer, "3.14",
          "pi variable should have initializer");
  });

  /**
   * Check the method nodes found in the CGraph.
   */
  test("cgraph methods", function() {
	  var cgraph = this.result.cgraph;
	  ok(cgraph.methods != undefined,
       "cgraph should contain methods map");

    var methodTypes = classifyMethods(cgraph.methods);
	  equal(methodTypes.invalid.length, 0,
          "there should be no methods without inputs or outputs array");
	  equal(methodTypes.d2r.length, 1,
          "there should be exactly one method for diameter ==> radius");
	  equal(methodTypes.r2d.length, 1,
          "there should be exactly one method for radius ==> diameter");
	  equal(methodTypes.a2r.length, 1,
          "there should be exactly one method for area ==> result");
	  equal(methodTypes.extra.length, 0,
          "there should be no methods other than the three expected");

	  var diameter = cgraph.variables.diameter;
	  ok(diameter.usedBy.length == 1 && diameter.usedBy[0] == methodTypes.d2r[0],
		   "diameter variable should be usedBy diameter ==> radius method");

	  var radius = cgraph.variables.radius;
	  ok(radius.usedBy.length == 2
		   && (   (radius.usedBy[0] == methodTypes.r2d[0]
               && radius.usedBy[1] == methodTypes.a2r[0])
           || (radius.usedBy[0] == methodTypes.a2r[0]
               && radius.usedBy[1] == methodTypes.r2d[0])),
		   "radius variable should be usedBy radius ==> diameter && area ==> result methods")

	  var result = cgraph.variables.result;
	  ok(result.usedBy.length == 0,
       "result variable should not be usedBy any methods");

    var pi = cgraph.variables.pi;
    ok(pi.usedBy.length == 1 && pi.usedBy[0] == methodTypes.a2r[1],
       "diameter variable should be usedBy area ==> result method");
  });

  /**
   * Check the constraint nodes found in the CGraph.
   */
  test("cgraph constraints", function() {
	  var cgraph = this.result.cgraph;
	  ok(cgraph.constraints != undefined,
       "cgraph should contain constraint map");
	  equal(Object.keys(cgraph.constraints).length, 2,
          "cgraph should have 2 constraints");

    var methodTypes = classifyMethods(cgraph.methods);
    var constraintTypes = {invalid: [], extra: [], logic: [], output: []};
    for (var constraintId in cgraph.constraints) {
      var constraint = cgraph.constraints[constraintId];
      if (constraint.methods == undefined) {
        constraintTypes.invalid.push(constraintId);
      }
      else if (constraint.methods.length == 2
               && (   (constraint.methods[0] == methodTypes.d2r[0]
                       && constraint.methods[1] == methodTypes.r2d[0])
                   || (constraint.methods[0] == methodTypes.r2d[0]
                       && constraint.methods[1] == methodTypes.d2r[0]))) {
        constraintTypes.logic.push(constraintId);
      }
      else if (constraint.methods.length == 1
               && constraint.methods[0] == methodTypes.a2r[0]) {
        constraintTypes.output.push(constraintId);
      }
      else {
        constraintTypes.extra.push(constraintId);
      }
    }

    equal(constraintTypes.invalid.length, 0,
          "there should be no constraints without a method list");
    equal(constraintTypes.logic.length, 1,
          "there should be exactly one constraint for radius <==> diameter");
    equal(constraintTypes.output.length, 1,
          "there should be exactly one constraint for radius ==> result");
    equal(constraintTypes.extra.length, 0,
          "there should be no constraints other than the two expected");
  });

  /**
   * Test code generated for methods.
   */
  test("method definitions", function() {
    var methods = eval("(" + this.result.methods + ")");
    ok(methods != undefined,
       "should be able to evaluate code generated for methods");

    var methodTypes = classifyMethods(this.result.cgraph.methods);
    ok(methods[methodTypes.d2r[0]] instanceof Function,
       "should have method for diameter ==> radius");
    ok(methods[methodTypes.r2d[0]] instanceof Function,
       "should have method for radius ==> diameter");
    ok(methods[methodTypes.a2r[0]] instanceof Function,
       "should have method for area ==> result");
  });

})();
