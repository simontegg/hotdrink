(function () {

  var TentativeTest = function () {
    this.failed = 0;
  };

  TentativeTest.prototype = {};

  TentativeTest.prototype.ok = function (result, desc) {
    if (!result) ++this.failed;
  };

  TentativeTest.prototype.strictEqual = function (a, b, desc) {
    this.ok(a === b, desc);
  };

  TentativeTest.prototype.passed = function () {
    return this.failed === 0;
  };

  /**
   */
  var Pattern = function () {
  };

  var matchProperty = function (key, proof, cand, test) {
    if (proof instanceof Pattern) {
      proof.compare(cand, test);
    } else {
      test.strictEqual(cand, proof,
        "property '" + key + "' matches expected value");
    }
  };

  Pattern.prototype = {};

  Pattern.prototype.compare = function (cand, test) {
    test.ok(false,
      "incomplete pattern");
  };

  /**
   */
  var Min = function (pattern) {
    this.pattern = {};
    for (var key in pattern) {
      if (!pattern.hasOwnProperty(key)) continue;
      this.pattern[key] = pattern[key];
    }
  };

  Min.prototype = new Pattern();

  Min.prototype.compare = function (cand, test) {
    cand = cand || {};
    var compare = true;
    for (var key in this.pattern) {
      if (!this.pattern.hasOwnProperty(key)) continue;
      if (!(key in cand)) {
        test.ok(false,
          "candidate has property '" + key + "'");
        continue;
      }

      matchProperty(key, this.pattern[key], cand[key], test);
    }
  };

  /**
   */
  var Exact = function (pattern) {
    Min.call(this, pattern);
  };

  Exact.prototype = new Min();

  Exact.prototype.compare = function (cand, test) {
    Min.prototype.compare.call(this, cand, test);

    for (var key in cand) {
      if (!cand.hasOwnProperty(key)) continue;
      if (!(key in this.pattern)) {
        test.ok(false,
          "candidate does not have extra property ('" + key + "')");
      }
    }
  }

  /**
   */
  var MinSet = function (pattern) {
    this.pattern = {};
    for (var key in pattern) {
      if (!pattern.hasOwnProperty(key)) continue;
      this.pattern[key] = pattern[key];
    }
  };

  MinSet.prototype = new Pattern();

  MinSet.prototype.compare = function (cand, test) {
    var clone = {};
    for (var ckey in cand) {
      if (!cand.hasOwnProperty(ckey)) continue;
      clone[ckey] = cand[ckey];
    }

    this.map = {};
    for (var pkey in this.pattern) {
      if (!this.pattern.hasOwnProperty(pkey)) continue;
      for (ckey in clone) {
        if (!clone.hasOwnProperty(ckey)) continue;
        var ttest = new TentativeTest();
        matchProperty(ckey, this.pattern[pkey], clone[ckey], ttest);
        if (ttest.passed()) {
          this.map[pkey] = ckey;
          delete clone[ckey];
          break;
        }
      }
      if (!(pkey in this.map))
        test.ok(false,
          "candidate has property matching '" + pkey + "'");
    }
  };

  MinSet.prototype.keyThatMatched = function(key) {
    return this.map[key];
  };

  /**
   */
  var ExactSet = function (pattern) {
    MinSet.call(this, pattern);
  };

  ExactSet.prototype = new MinSet();

  ExactSet.prototype.compare = function (cand, test) {
    MinSet.prototype.compare.call(this, cand, test);

    var clone = {};
    for (var ckey in cand) {
      if (!cand.hasOwnProperty(ckey)) continue;
      clone[ckey] = cand[ckey];
    }
  
    for (var pkey in this.pattern) {
      if (!this.pattern.hasOwnProperty(pkey)) continue;
      delete clone[this.keyThatMatched(pkey)];
    }

    for (ckey in clone) {
      if (!clone.hasOwnProperty(ckey)) continue;
      test.ok(false,
        "candidate does not have extra property ('" + ckey + "')");
    }
  }

  namespace.open("hottest").patterns = {
    Pattern: Pattern,
    Exact: Exact,
    Min: Min,
    MinSet: MinSet,
    ExactSet: ExactSet,
  };

})();

