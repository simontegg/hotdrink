#!/bin/bash

DIR=/research/www/groups/pttlgroup/hotdrink

ssh parasol "cd $DIR; rm -rf doc"
scp -r doc parasol:$DIR/
ssh parasol "cd $DIR; update-www -rd doc"

