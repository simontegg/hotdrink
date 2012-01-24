function test1() {
  test("patterns.Min", function() {
    var foo = new patterns.Min({a: 3, b: 12, c: "hello"});
    foo.compare('one', {a: 3, b: 12, c: "hello"});
    foo.compare('two', {a: 3, b: 12, c: "hello", d: "goodbye"});
    foo.compare('three', {a: 3, c: "hello"});
    foo.compare('four', {a: 3, b: 12, c: "goodbye"});
    foo.compare('five', {a: 3, b: "12", c: "hello"});
    var goo = new patterns.Min({
      x: 8,
      y: "howdy",
      z: foo
    });
    goo.compare('six', {a: 3, x: 8, y: "howdy", z: {a: 3, b: 12, c: "hello"}});
    goo.compare('seven', {x: 8, y: "howdy", z: {a: 8, c: "hello"}});
  });

  test("patterns.Exact", function() {
    var foo = new patterns.Exact({a: 3, b: 12, c: "hello"});
    foo.compare('one', {a: 3, b: 12, c: "hello"});
    foo.compare('two', {a: 3, b: 12, c: "hello", d: "goodbye"});
    foo.compare('three', {a: 3, c: "hello"});
    foo.compare('four', {a: 3, b: 12, c: "goodbye"});
    foo.compare('five', {a: 3, b: "12", c: "hello"});
    var goo = new patterns.Exact({
      x: 8,
      y: "howdy",
      z: foo
    });
    goo.compare('six', {a: 3, x: 8, y: "howdy", z: {a: 3, b: 12, c: "hello"}});
    goo.compare('seven', {x: 8, y: "howdy", z: {a: 8, c: "hello"}});
  });
}

function test3() {
  var foo = new patterns.MinSet(['a', 3, 'goodbye']);

  if (foo.matches(['a', 3, 'goodbye']))
    alert( 'Yay!' );
  else
    alert( 'Boo!' )

  if (foo.matches([3, 'goodbye', 'a']))
    alert( 'Yay!' );
  else
    alert( 'Boo!' )

  if (foo.matches({x: 'goodbye', y: 3, z: 'a'}))
    alert( 'Yay!' );
  else
    alert( 'Boo!' )

  if (foo.matches(['a', 3, 'goodbye', 'hello']))
    alert( 'Yay!' )
  else
    alert( 'Boo!' );

  if (foo.matches([3, 'goodbye']))
    alert( 'Boo!' )
  else
    alert( 'Yay!' );
}


function test4() {
  var foo = new patterns.ExactSet(['a', 3, 'goodbye']);

  if (foo.matches(['a', 3, 'goodbye']))
    alert( 'Yay!' );
  else
    alert( 'Boo!' )

  if (foo.matches([3, 'goodbye', 'a']))
    alert( 'Yay!' );
  else
    alert( 'Boo!' )

  if (foo.matches({x: 'goodbye', y: 3, z: 'a'}))
    alert( 'Yay!' );
  else
    alert( 'Boo!' )

  if (foo.matches(['a', 3, 'goodbye', 'hello']))
    alert( 'Boo!' )
  else
    alert( 'Yay!' );

  if (foo.matches([3, 'goodbye']))
    alert( 'Boo!' )
  else
    alert( 'Yay!' );
}
