/**
 * @fileOverview <p>{@link hotdrink.ModelFactory}</p>
 * @author John Freeman
 */

//provides("hotdrink.ModelFactory");

(function () {

  var ModelFactory = function () {
  };

  ModelFactory.prototype.variable = function variable(value) {
    var proxy = function () {
      return value;
    };

    proxy.hotdrink = {
      type : "interface"
    };

    return proxy;
  };

  ModelFactory.prototype.computed = function computed(fn) {
    var proxy = fn;

    proxy.hotdrink = {
      type : "output",
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

  ModelFactory.prototype.model = function model(src) {

    var cgraph = { variables : {}, methods : {}, constraints : {} };

    Object.keys(src).forEach(function (v) {
      var vSrc = src[v];
      var vv = cgraph.variables[v] = {
        cellType : cellTypeOf(vSrc),
        /* TODOD: Needed for enablement only. Need to find a workaround. */
        usedBy : []
      };

      if (vv.cellType === "interface") {
        /* vSrc is a proxy */
        vv.initializer = vSrc;

      } else if (vv.cellType === "output") {
        /* vSrc is a proxy */
        var m = makeName("method");
        var mm = cgraph.methods[m] = {
          inputs : [],
          outputs : [v],
          execute : vSrc
        };

        var c = makeName("constraint");
        var cc = cgraph.constraints[c] = {
          methods : [m]
        };

      } else if (vv.cellType === "constant") {
        /* vSrc is a constant */
        vv.initializer = function (/*model*/) { return vSrc; };

      //} else {
        // unreachable
      }

    });

    LOG("cgraph = " + JSON.stringify(cgraph));

    var model = new hotdrink.Model(cgraph);
    var modelController = new hotdrink.controller.ModelController(model);

    return modelController;
  };

  window.hd = new ModelFactory();

}());

