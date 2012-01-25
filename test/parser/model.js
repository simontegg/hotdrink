(function() {

  /**
   * Module definition
   */
  module("hotdrink.parser.ModelParser");

  /**
   * Test that parse function works and has return value.
   */
  test("general", function() {
    var result = hotdrink.parser.ModelParser.parse("sheet {}");
	  notStrictEqual(result, undefined,
      "parse function returns something");
	  notStrictEqual(result.cgraph, undefined,
      "parse function returns cgraph");
	  notStrictEqual(result.methods, undefined,
      "parse function returns methods");
  });

  test("circle cgraph", function() {
    var result = hotdrink.parser.ModelParser.parse(hottest.circle.adam);

    var P = hottest.patterns;

    var cgraph = P.exact({
      variables : P.exact({
        radius : P.min({
          cellType : "input",
          usedBy : P.minSet([]),
          initializer : 10
        }),
        diameter : P.min({
          cellType : "interface",
          usedBy : P.minSet([])
        }),
        result : P.min({
          cellType : "output",
          usedBy : P.minSet([])
        }),
        pi : P.min({
          cellType : "constant",
          usedBy : P.minSet([]),
          initializer : 3.14
        })
      }),
      methods : P.exactSet({
        m1 : P.exact({
          inputs : P.exactSet(["radius"]),
          outputs : P.exactSet(["diameter"])
        }),
        m2 : P.exact({
          inputs : P.exactSet(["diameter"]),
          outputs : P.exactSet(["radius"])
        }),
        m3 : P.exact({
          inputs : P.exactSet(["radius", "pi"]),
          outputs : P.exactSet(["result"])
        }),
      }),
      constraints : P.exactSet({
        c1 : P.exact({ methods : P.minSet([]) }),
        c2 : P.exact({ methods : P.minSet([]) })
      })
    });

    cgraph.compare(result.cgraph, QUnit);
  });

  /**
   * Test code generated for methods.
   */
  test("circle methods", function() {
    var result = hotdrink.parser.ModelParser.parse(hottest.circle.adam);
    var methods = eval("(" + result.methods + ")");
    notStrictEqual(methods, undefined,
       "can evaluate code generated for methods");
  });

})();

