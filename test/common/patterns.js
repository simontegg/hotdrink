(function () {

  /**
   */
  function Pattern() {
  }

  Pattern.prototype = new Object();

  Pattern.prototype.compare = function(name, object) {
    QUnit.ok(false,
             "incomplete pattern to compare against " + name);
  }

  /**
   */
  function Min(pattern) {
    this.pattern = new Object();
    for (var key in pattern) {
      this.pattern[key] = pattern[key];
    }
  }

  Min.prototype = new Pattern();

  Min.prototype.compare = function(name, object) {
    object = object || {};
    var compare = true;
    for (var key in this.pattern) {
      if (key in object) {
        if (this.pattern[key] instanceof Pattern) {
          this.pattern[key].compare(name + "." + key, object[key]);
        }
        else {
          QUnit.equal(object[key], this.pattern[key],
                      name + "." + key + " should match expected value");
        }
      }
      else {
        QUnit.ok(false,
                 name + " should contain " + key + " property");
      }
    }
  }

  /**
   */
  function Exact(pattern) {
    Min.call(this, pattern);
  }

  Exact.prototype = new Min();

  Exact.prototype.compare = function(name, object) {
    Min.prototype.compare.call(this, name, object);

    var extra = 0;
    for (var key in object)
      if (! (key in this.pattern))
        ++extra;
    QUnit.equal(extra, 0,
                name + " should not have any extra properties");
  }

  /**
   */
  function MinSet(pattern) {
    this.pattern = new Array();

    for (var key in pattern) {
      this.pattern[key] = pattern[key];
    }
  }

  MinSet.prototype = new Pattern();

  MinSet.prototype.compare = function(object) {
    var clone = new Object();
    for (var okey in object) {
      clone[okey] = object[okey];
    }

    this.map = new Object();
    var compare = true;
    for (var pkey in this.pattern) {
      if (this.pattern[pkey] instanceof Pattern) {
        for (var ckey in clone) {
          if (this.pattern[pkey].compare(clone[ckey])) {
            this.map[pkey] = ckey;
            delete clone[ckey];
            break;
          }
        }
      }
      else {
        for (var ckey in clone) {
          if (this.pattern[pkey] === clone[ckey]) {
            this.map[pkey] = ckey;
            delete clone[ckey];
            break;
          }
        }
      }
      if (! (pkey in this.map))
        return false;
    }

    return true;
  }

  MinSet.prototype.keyThatMatched = function(patternKey) {
    return this.map[patternKey];
  }

  /**
   */
  function ExactSet(pattern) {
    MinSet.call(this, pattern);
  }

  ExactSet.prototype = new MinSet();

  ExactSet.prototype.compare = function(object) {
    if (MinSet.prototype.compare.call(this, object)) {
      var pattern_count = 0;
      for (var key in this.pattern) {
        ++pattern_count;
      }
      var object_count = 0;
      for (var key in object) {
        ++object_count;
      }
      return pattern_count == object_count;
    }
    else
      return false;
  }

  /**
   */
  function MinKeys(pattern) {
    this.keys = new Array();
    if (pattern instanceof Array) {
      for (var i = 0; i < pattern.length; ++i)
        this.keys[i] = pattern[i];
    }
    else {
      for (var key in pattern) {
        this.keys.push(key);
      }
    }
  }

  MinKeys.prototype = new Pattern();

  MinKeys.prototype.compare = function(object) {
    for (var i = 0; i < this.pattern.size; ++i) {
      if (! (this.pattern[i] in object))
        return false;
    }
    return true;
  }

  patterns = {Pattern: Pattern,
              Exact: Exact,
              Min: Min,
              MinSet: MinSet,
              ExactSet: ExactSet,
             };
})();