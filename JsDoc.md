# Introduction #

[JsDoc Toolkit](http://code.google.com/p/jsdoc-toolkit/) is used for documentation generation within the HotDrink project.


# Instructions #

  1. Download [beta version 2.4.0](http://code.google.com/p/jsdoc-toolkit/downloads/detail?name=jsdoc_toolkit-2.4.0.zip).
  1. Unzip.
  1. Make included driver script executable.
```
$ chmod +x jsrun.sh
```
  1. Write better driver script. Save under the file name **jsdoc** somewhere in your PATH.
```
#!/bin/sh

export JSDOCDIR=/path/tojsdoc-toolkit
export JSDOCTEMPLATEDIR=$JSDOCDIR/templates/jsdoc
exec $JSDOCDIR/jsrun.sh $*
```
  1. Use.
```
$ make doc
```