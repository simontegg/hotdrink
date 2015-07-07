## Structure ##

The hierarchy of the HotDrink repository is described below:

  * **c++/**
    * **adam/** <br> Preliminary work on a backend substitute for Adobe's Adam engine.<br>
<ul><li><b>solver/</b> <br> A constraint graph, solution graph, and QuickPlan solver utilizing the Boost Graph Library.<br>
</li></ul><ul><li><b>docs/</b> <br> Various early (and possibly outdated) documentation. The <a href='http://code.google.com/p/hotdrink/w/list'>HotDrink wiki</a> and <a href='https://parasol.tamu.edu/groups/pttlgroup/hotdrink/doc/symbols/hotdrink.html'>HotDrink jsdoc</a> should be consulted first. All documentation will move there eventually.<br>
</li><li><b>haskell/</b>
<ul><li><b>parser/</b> <br> Adam parser.<br>
</li><li><b>visualizer/</b> <br> Experimentation from Jaakko with real-time PDF visualization of solution graphs.<br>
</li></ul></li><li><b>javascript/</b>
<ul><li><b>hotdrink/</b> <br> The JavaScript library and test pages.</li></ul></li></ul>

<h2>Branches</h2>

Official branches are documented below. Other branches are subject to removal from the master repository.<br>
<br>
<ul><li><b>master</b> = Latest release.<br>
<ul><li><b>old-master</b> = Last revision of repository before major restructuring. Kept just in case. Do not touch.<br>
</li><li><b>new-master</b> = First revision of repository after major restructuring. Kept just in case. Do not touch.<br>
</li></ul></li><li><b>develop</b> = Latest working state.<br>
</li><li><b>pinning</b> = Feature branch for Wonseok's pinning work. Needs review and integration to develop.<br>
</li><li><b>undo</b> = Feature branch for Wonseok's undo work. Needs review and integration to develop.</li></ul>

The following branches are on the chopping block. I either don't know their purpose or don't know how to harvest their contributions.<br>
<br>
<ul><li><b><a href='https://code.google.com/p/hotdrink/issues/detail?id=1'>issue1</a></b> = Presumably for initialization work. Probably broken by recent work.<br>
</li><li><b>examples</b> = Presumably for tests. Probably broken by recent work.<br>
</li><li><b>gabe-test</b> = Temporary repo for sharing work. Probably merged already.