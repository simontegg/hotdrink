var namespace = (function () {

  var open1 = function (name, parent) {
    //if (typeof parent === "undefined") {
      //parent = window;
    //}
    ASSERT(
      typeof parent === "object"
      || typeof parent === "function",
      "parent of \"" + name + "\" is not a namespace");
    if (!(name in parent)) {
      parent[name] = {};
    }
    var result = parent[name];
    ASSERT(
      typeof result === "object"
      || typeof result === "function",
      "\"" + name + "\" is not a namespace");
    return result;
  };

  var open = function (name) {
    var hierarchy = name.split(".");
    var parent = window;
    hierarchy.each(function (name) {
      parent = open1(name, parent);
    });
    return parent;
  };

  var extend = function (name, components) {
    var ns = open(name);
    Object.extend(ns, components);
  };

  return {
    open : open,
    extend : extend
  };

}());

