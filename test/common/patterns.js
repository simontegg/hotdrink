(function () {

  var TentativeTest = function () {
    this.failed = 0;
  };

  TentativeTest.prototype = {};

  TentativeTest.prototype.ok = function (result, desc) {
    if (!result) ++this.failed;
  };

  TentativeTest.prototype.strictEqual = function (a, b, desc) {
    if (a !== b) ++this.failed;
  };

  TentativeTest.prototype.passed = function () {
    return failed === 0;
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
      this.pattern[key] = pattern[key];
    }
  };

  Min.prototype = new Pattern();

  Min.prototype.compare = function (cand, test) {
    cand = cand || {};
    var compare = true;
    for (var key in this.pattern) {
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
      this.pattern[key] = pattern[key];
    }
  };

  MinSet.prototype = new Pattern();

  MinSet.prototype.compare = function (cand, test) {
    var clone = {};
    for (var ckey in cand) {
      clone[key] = cand[key];
    }

    this.map = {};
    for (var pkey in this.pattern) {
      for (ckey in clone) {
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
      clone[key] = cand[key];
    }
  
    for (var pkey in this.pattern) {
      delete clone[this.keyThatMatched(pkey)];
    }

    for (ckey in clone) {
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

