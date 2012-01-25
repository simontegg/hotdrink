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

  var matchProperty = function (key, proof, cand, test, keyMap) {
    LOG("key = " + key);
    LOG("keyMap = " + Object.toJSON(keyMap));
    if (proof instanceof Pattern) {
      proof.compare(cand, test, keyMap);
    } else {
      test.strictEqual(cand, proof,
        "property '" + key + "' matches expected value");
    }
  };

  /**
   */
  var Pattern = function () {
  };

  Pattern.prototype = {};

  Pattern.prototype.compare = function () {
    test.ok(false,
      "error: incomplete pattern");
  };

  var Key = function (key) {
    this.key = key;
  };

  Key.prototype = new Pattern();

  Key.prototype.compare = function (cand, test, keyMap) {
    if (!keyMap[key]) {
      test.ok(false,
        "error: key '" + key + "' has not been mapped");
    } else {
      test.strictEqual(cand, keyMap[key],
        "candidate matches key '" + key + "'");
    }
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

  Min.prototype.compare = function (cand, test, keyMap) {
    keyMap = keyMap || {};

    for (var key in this.pattern) {
      if (!this.pattern.hasOwnProperty(key)) continue;

      if (!(key in cand)) {
        test.ok(false,
          "error: candidate missing property '" + key + "'");
        continue;
      }

      matchProperty(key, this.pattern[key], cand[key], test,  keyMap);
    }
  };

  /**
   */
  var Exact = function (pattern) {
    Min.call(this, pattern);
  };

  Exact.prototype = new Min();

  Exact.prototype.compare = function (cand, test, keyMap) {
    keyMap = keyMap || {};

    Min.prototype.compare.call(this, cand, test, keyMap);

    for (var key in cand) {
      if (!cand.hasOwnProperty(key)) continue;
      if (!(key in this.pattern)) {
        test.ok(false,
          "error: candidate has extra property ('" + key + "')");
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

  MinSet.prototype.compare = function (cand, test, keyMap) {
    keyMap = keyMap || {};

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
        var tkeyMap = Object.clone(keyMap);
        tkeyMap[pkey] = ckey;

        matchProperty(ckey, this.pattern[pkey], clone[ckey], ttest, tkeyMap);

        if (ttest.passed()) {
          Object.extend(keyMap, tkeyMap);
          delete clone[ckey];
          break;
        }
      }

      if (!(pkey in keyMap)) {
        test.ok(false,
          "error: candidate has no property matching '" + pkey + "'");
      }
    }
  };

  /**
   */
  var ExactSet = function (pattern) {
    MinSet.call(this, pattern);
  };

  ExactSet.prototype = new MinSet();

  ExactSet.prototype.compare = function (cand, test, keyMap) {
    keyMap = keyMap || {};

    MinSet.prototype.compare.call(this, cand, test, keyMap);

    var clone = {};
    for (var ckey in cand) {
      if (!cand.hasOwnProperty(ckey)) continue;
      clone[ckey] = cand[ckey];
    }
  
    for (var pkey in this.pattern) {
      if (!this.pattern.hasOwnProperty(pkey)) continue;
      delete clone[keyMap[pkey]];
    }

    for (ckey in clone) {
      if (!clone.hasOwnProperty(ckey)) continue;
      test.ok(false,
        "error: candidate has extra property ('" + ckey + "')");
    }
  }

  var construct = function (Ctor) {
    return function (pattern, keyOrder) {
      return new Ctor(pattern, keyOrder);
    }
  };

  namespace.open("hottest").patterns = {
    Pattern: Pattern,
    key : construct(Key),
    min : construct(Min),
    exact : construct(Exact),
    minSet : construct(MinSet),
    exactSet : construct(ExactSet)
  };

})();

