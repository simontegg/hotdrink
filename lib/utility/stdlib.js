var empty = function () {};

function identity(x) {
  return x;
};

function contains(a, x) {
  return a.indexOf(x) >= 0;
};

function setDifference (a, b) {
  return [].without.apply(a, b);
};

function setUnion(a, b) {
  return a.concat(b).uniq();
};

function setIntersect(a, b) {
  return a.intersect(b);
};

Array.prototype.remove = function (item) {
  var i = this.indexOf(item);
  if (i >= 0) {
    this.splice(i, 1);
  }
};

/**
 * @name debounce
 * @memberOf window
 * @description A good debouncing function. Credit to John Hann.
 * @public
 * @static
 * @function
 * @param {Function} func
 *   The function to debounce.
 * @param {Integer} [threshold=100]
 *   The maximum time, in milliseconds, between consecutive executions that
 *   should be considered the same execution.
 * @param {Boolean} [execAsap=false]
 *   Whether to execute the function at the beginning (true) or end (false) of
 *   the debouncing.
 * @returns {Function}
 *   The debounced function.
 */
var debounce = function (func, threshold, execAsap) {
  /* Default arguments. */
  if (typeof threshold === "undefined") threshold = 100;
  if (typeof execAsap === "undefined") execAsap = false;
  /* The handler from the last call to setTimeout. A null value indicates
   * debouncing has not begun anew yet. */
  var timeout = null;
  /* Return the debounced function. */
  return function debounced () {
    /* The debounced function captures its current context and arguments to be
     * passed to func later. */
    var context = this, args = arguments;
    /* This function will be executed at the end of debouncing. */
    function delayed () {
      /* If we chose to execute at the end of debouncing, then do it now. */
      if (!execAsap)
        func.apply(context, args);
      /* Indicate debouncing has ended. */
      timeout = null; 
    };
    /* If we're debouncing, clear the clock. We'll set it again later. */
    if (timeout)
      clearTimeout(timeout);
    /* Else we're starting debouncing, so if we chose to execute immediately,
     * then do it now. */
    else if (execAsap)
      func.apply(obj, args);
    /* Set the clock. */
    timeout = setTimeout(delayed, threshold); 
  };
};

