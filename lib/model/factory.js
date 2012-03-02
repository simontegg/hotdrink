/**
 * @fileOverview <p>{@link hotdrink.model.Factory}</p>
 * @author John Freeman
 */

//provides("hotdrink.model.Factory");

(function () {

  /************************************/
  /* Helpers. */

  var idNo = 0;

  var makeName = function makeName(kind) {
    if (idNo === Number.MAX_VALUE) idNo = 0;
    return "__" + kind + (idNo++);
  };

  /************************************/
  /* Initialization. */

  var Factory = function Factory() {
    this.constraints = [];
    this.cgraph = { variables : {}, methods : {}, constraints : {} };
  };

  /************************************/
  /* Variables. */

  Factory.prototype.variable = function variable(value) {
    var getter = function () {
      return value;
    };

    getter.hotdrink = {
      type : "interface"
    };

    return getter;
  };

  Factory.prototype.computed = function computed(fn) {
    var getter = fn;

    getter.hotdrink = {
      type : "logic",
      fn : fn
    };

    return getter;
  };

  /************************************/
  /* Constraints. */

  var Constraint = function () {
    this.methods = {};
  };

  Factory.prototype.constraint = function constraint() {
    var cn = new Constraint();
    this.constraints.push(cn);
    return cn;
  };

  Constraint.prototype.method = function method(outputs, fn) {
    if (!Array.isArray(outputs)) outputs = [outputs];
    /* outputs should be an array of variable names. */

    var m = makeName("method");
    this.methods[m] = {
      outputs : outputs,
      execute : fn
    };

    return this;
  };

  /************************************/
  /* Commands. */

  var addOneWayConstraint = function addOneWayConstraint(cgraph, v, fn) {
    var m = makeName("method");
    cgraph.methods[m] = {
      outputs : [v],
      execute : fn
    };

    var c = makeName("constraint");
    cgraph.constraints[c] = {
      methods : [m]
    };
  };

  var addSink = function addSink(cgraph, cellType, v, fn) {
    cgraph.variables[v] = {
      cellType : cellType
    };

    addOneWayConstraint(cgraph, v, fn);
  };

  Factory.prototype.command = function command(fn) {
    /* Same dangers in calling this as in accessing computed variables. */
    var placeholder = function () {
      /* The command isn't prepared because we haven't yet evaluated the model.
       * Prepare and call it now to give the illusion that I am it. */
      cmd = fn.call(this);
      return cmd.apply(this, arguments);
    };

    placeholder.hotdrink = {
      type : "output",
      fn : fn
    };

    return placeholder;
  };

  /* This helps us wrap a function call so it can be executed later,
   * if desired. */
  Factory.prototype.fn = function fn(fnToWrap) {
    /* The outer function takes the arguments to be passed to the wrapped
     * function. It will be called inside a method. It will return a wrapped
     * function to be stored as the value of the output variable.
     *
     * The inner function will call the wrapped function with both the stored
     * arguments from the method and any new arguments. It may be called by the
     * user. */
    return function () {
      var argsToPass = [].slice.call(arguments);
      return function () {
        return fnToWrap.apply(this, argsToPass.concat(arguments));
      };
    };
  };

  Factory.prototype.invariant = function invariant(fn) {
    var v = makeName("variable");
    addSink(this.cgraph, "invariant", v, fn);
  };

  /************************************/
  /* Final processing. */

  var cellTypeOf = function cellTypeOf(vSrc) {
    /* Wanted to use instanceof, but does not seem to be possible. */
    return (typeof vSrc === "function" && vSrc.hotdrink)
      ? (vSrc.hotdrink.type)
      : ("constant");
  };

  var defaultOutputFn = function defaultOutputFn() {
    var data = {};
    Object.keys(this).forEach(function (v) {
      var getter = this[v];
      if (typeof getter === "function") {
        /* Reject any function that is not a variable getter. We cannot
         * serialize function constants for form submission anyway. */
        if (!getter.isVariable) return;
        data[v] = getter();
      } else {
        data[v] = getter;
      }
    }, this);
    var url = location.protocol + location.hostname + location.pathname;
    return hd.fn(submitForm)(url, data);
  };

  Factory.prototype.model = function model(src) {

    var cgraph = this.cgraph;
    var hasOutput = false;

    Object.keys(src).forEach(function (v) {
      var vSrc = src[v];
      var vv = cgraph.variables[v] = {
        cellType : cellTypeOf(vSrc)
      };

      if (vv.cellType === "interface") {
        /* vSrc is a proxy */
        vv.initializer = vSrc;

      } else if (vv.cellType === "logic") {
        /* vSrc is a proxy */
        addOneWayConstraint(cgraph, v, vSrc);

      } else if (vv.cellType === "output") {
        /* vSrc is a placeholder */
        addOneWayConstraint(cgraph, v, vSrc.hotdrink.fn);
        hasOutput = true;

      } else {
        ASSERT(vv.cellType === "constant", "unexpected cellType");
        /* vSrc is a constant */
        vv.initializer = function (/*model*/) { return vSrc; };
      }
    });

    /* The default output variable will access every variable so that they are
     * all relevant. */
    if (!hasOutput) {
      /* Give it a name people can use, unless they wanted something else to
       * have that name. */
      var v = "submit";
      if (cgraph.variables.hasOwnProperty("submit")) {
        v = makeName("variable");
      }

      addSink(cgraph, "output", v, defaultOutputFn);
    }

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

    var model = new hotdrink.model.Model(cgraph);
    var modelController = new hotdrink.model.Controller(model);

    return modelController;
  };

  namespace.open("hotdrink.model").Factory = Factory;
  window.hd = new Factory();

}());

