/* syncedSnapshotE :: EventStream a -> Behavior b -> EventStream b
   Waits until the behavior has updated before capturing its value. */
var syncedSnapshotE = function (evt, bhv) {
  return mergeE(evt.constantE(true), bhv.changes().constantE(false))
         .filterE(identity)
         .snapshotE(bhv);
}

var unapply = function () { return arguments; }

/* syncedMultiSnapshotE :: EventStream a ->
                           Behavior b1 -> Behavior b2 -> ...  ->
                           EventStream [b1, b2, ...]
   Same, but collects a bunch of values. */
var syncedMultiSnapshotE = function (evt /*, behaviors */) {
  var argBs = slice(arguments, 1);
  
  var argsB = liftB.apply(this, [unapply].concat(argBs));

  return syncedSnapshotE(evt, argsB);
}

/* liftOnEventE :: EventStream _
                   -> (a1 -> a2 -> ... -> result)
                   -> Behavior a1 -> Behavior a2 -> ...
                   -> EventStream result
   Apply a function to several behaviors after they've updated, but only when a
   trigger event fires. */
var liftOnEventE = function (evt, fn /*, behaviors */) {
  var argBs = slice(arguments, 2);
  
  return syncedMultiSnapshotE.apply(this, [evt].concat(argBs))
         .mapE(function (args) { return fn.apply(this, args); });
}

/* liftE :: (a1 -> a2 -> ... -> result)
            -> Behavior a1 -> Behavior a2 -> ...
            -> EventStream result
   Create an event stream that fires the given function whenever a given
   behavior changes. */
var liftE = function (fn /*, behaviors */) {
  var argBs = slice(arguments, 1);
  var evt = mergeE.apply(this, argBs.map(changes));
  return liftOnEventE.apply(this, [evt, fn].concat(argBs));
}

