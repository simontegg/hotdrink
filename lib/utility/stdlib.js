var empty = function () {};

function identity(x) {
  return x;
}

function contains(a, x) {
  return a.indexOf(x) >= 0;
}

function setDifference (a, b) {
  return [].without.apply(a, b);
}

function setUnion(a, b) {
  return a.concat(b).uniq();
}

function setIntersect(a, b) {
  return a.intersect(b);
}

Array.prototype.remove = function (item) {
  var i = this.indexOf(item);
  if (i >= 0) {
    this.splice(i, 1);
  }
}

