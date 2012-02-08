/**
 * @fileOverview <p>{@link hotdrink.ModelFactory}</p>
 * @author John Freeman
 */

//provides("hotdrink.ModelFactory");

(function () {

  var ModelFactory = function () {
    this.cgraph = { variables : {}, methods : {}, constraints : {} };
    this.vid = 0;
    this.mid = 0;
    this.cid = 0;
  };

  var fnOnly = function (fnOrExpr) {
    var fn = fnOrExpr;
    if (typeof fnOrExpr === "string") {
      fn = new Function("model", "return (" + expr + ");");
    } else {
      ASSERT(typeof fnOrExpr === "function",
        "expected function or expression");
    }
    return fn;
  };

  ModelFactory.prototype = {

    makeVariableName : function () {
      return "__variable" + (this.vid++);
    },
    makeVariable : function (v, cellType) {
      return this.variables[v] = { cellType : cellType, usedBy : [] };
    },

    /**
     * Initializer optional. All expressions should be strings with variable
     * references in the form of "model.get(v)".
     */
    addInterface : function (v, initializer) {
      var vv = this.makeVariable(v, "interface");
      if (initializer) {
        vv.initializer = fnOnly(initializer);
      }
    },
    addInput : function (v, initializer) {
      var vv = this.makeVariable(v, "input");
      if (initializer) {
        vv.initializer = fnOnly(initializer);
      }
    },
    /* Initializer is required for constants. */
    addConstant : function (v, initializer) {
      var vv = this.makeVariable(v, "input");
      vv.initializer = fnOnly(initializer);
    },

    addSink : function (cellType, body, inputs) {
      var v = this.makeVariableName();
      var vv = this.makeVariable(v, cellType);
      var m = this.addMethod([v], body, inputs);
      this.addConstraint(m);
      return m;
    },
    addExpression : function (body, inputs) {
      this.addSink("logic", body, inputs);
    },
    addInvariant : function (body, inputs) {
      this.addSink("invariant", body, inputs);
    },
    addOutput : function (body, inputs) {
      this.addSink("output", body, inputs);
    },

    makeMethodName : function () {
      return "__method" + (this.mid++);
    },
    addMethod(outputs, body, inputs) {
      var m = this.makeMethodName();

      var execute = fnOnly(body);

      this.cgraph.methods[m] = {
        inputs : inputs,
        outputs : outputs,
        execute : execute
      };

      inputs.forEach(function (v) {
        this.cgraph.variables[v].usedBy.push(m);
      }, this);

      return m;
    },

    makeConstraintName : function () {
      return "__constraint" + (this.cid++);
    },
    addConstraint : function (/*...*/) {
      var ms = arguments;
      var c = this.makeConstraintName();
      this.cgraph.constraints[c] = { methods : ms };
    }

  };

  namespace.open("hotdrink").ModelFactory = ModelFactory;

}());

