#!/bin/bash

ln -s ../../hotdrink.js js/
ln -s ../doc
cd ..
gmake
gmake doc

