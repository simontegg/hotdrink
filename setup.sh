#!/bin/bash

gmake
gmake parser
gmake dijit
gmake test
mkdir -p test/js
cd test/js
ln -s ../../hotdrink.js
ln -s ../../hotdrink-parser.js
ln -s ../../hotdrink-dijit.js
ln -s ../../hotdrink-test.js

