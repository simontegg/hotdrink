/**
 * @fileOverview <p>{@link hotdrink.Factory}</p>
 * @author John Freeman
 */

//provides("hotdrink.Factory");

(function () {

  var Factory = function () {
    this.constraints = [];
    this.cgraph = { variables : {}, methods : {}, constraints : {} };
  };

  Factory.prototype.variable = function variable(value) {
    var proxy = function () {
      return value;
    };

    proxy.hotdrink = {
      type : "interface"
    };

    return proxy;
  };

  Factory.prototype.computed = function computed(fn) {
    var proxy = fn;

    proxy.hotdrink = {
      type : "logic",
      fn : fn
    };

    return proxy;
  };

  var cellTypeOf = function cellTypeOf(vSrc) {
    /* Wanted to use instanceof, but does not seem to be possible. */
    return (typeof vSrc === "function" && vSrc.hotdrink)
      ? (vSrc.hotdrink.type)
      : ("constant");
  };

  var idNo = 0;

  var makeName = function makeName(kind) {
    if (idNo === Number.MAX_VALUE) idNo = 0;
    return "__" + kind + (idNo++);
  };

  var Constraint = function () {
    this.methods = {};
  };

  Constraint.prototype.bind = function bind(outputs, fn) {
    if (!Array.isArray(outputs)) outputs = [outputs];
    /* outputs should be an array of variable names. */

    var m = makeName("method");
    this.methods[m] = {
      outputs : outputs,
      execute : fn
    };

    return this;
  };

  Factory.prototype.constraint = function constraint() {
    var cn = new Constraint();
    this.constraints.push(cn);
    return cn;
  };

  var makeSink = function makeSink(cellType, v, fn) {
    this.cgraph.variables[v] = {
      cellType : cellType
    };

    var m = makeName("method");
    this.cgraph.methods[m] = {
      outputs : [v],
      execute : fn
    };

    var c = makeName("constraint");
    this.cgraph.constraints[c] = {
      methods : [m]
    };
  };

  Factory.prototype.output = function output(fn) {
    var v = "result";
    ASSERT(this.cgraph.variables[v] === undefined,
      "cannot declare more than one output");
    makeSink.call(this, "output", v, fn);
  };

  Factory.prototype.invariant = function invariant(fn) {
    var v = makeName("variable");
    makeSink.call(this, "invariant", v, fn);
  };

  Factory.prototype.model = function model(src) {

    var cgraph = this.cgraph;

    Object.keys(src).forEach(function (v) {
      var vSrc = src[v];
      var vv = cgraph.variables[v] = {
        cellType : cellTypeOf(vSrc)
      };

      if (vv.cellType === "interface") {
        /* vSrc is a proxy */
        vv.initializer = vSrc;

      } else if (vv.cellType === "logic" || vv.cellType === "output") {
        /* vSrc is a proxy */
        var m = makeName("method");
        cgraph.methods[m] = {
          outputs : [v],
          execute : vSrc
        };

        var c = makeName("constraint");
        cgraph.constraints[c] = {
          methods : [m]
        };

      } else {
        ASSERT(vv.cellType === "constant", "unexpected cellType");
        /* vSrc is a constant */
        vv.initializer = function (/*model*/) { return vSrc; };
      }
    });

    this.constraints.forEach(function (cn) {
      Object.keys(cn.methods).forEach(function (m) {
        cgraph.methods[m] = cn.methods[m];
      });

      var c = makeName("constraint");
      var cc = cgraph.constraints[c] = {
        methods : Object.keys(cn.methods)
      };
    });

    this.constraints.length = 0;
    this.cgraph = { variables : {}, methods : {}, constraints : {} };

    LOG("cgraph = " + JSON.stringify(cgraph));

    var model = new hotdrink.Model(cgraph);
    var modelController = new hotdrink.controller.ModelController(model);

    return modelController;
  };

  window.hd = new Factory();

}());

