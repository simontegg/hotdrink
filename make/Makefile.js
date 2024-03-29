# Include me to get automatic support for building a JavaScript library.

# Several default targets are enumerated below. By defining your own values for
# the exported variables, you can customize the default target behavior.

# Different libraries will need to exercise caution when using the same OBJDIR
# and DOCDIR. I assume the client library owns these directories. Cleaning one
# library will clean any others sharing these directories.

##################################################
# automatic configuration

export MAIN
export MAINPLUS
export SRCDIR
export HEADERS
export SOURCES
export THIRD_PARTY_SOURCES
export OBJDIR
export DOCDIR

##################################################
# targets

DEFERRED_TARGETS := \
	all \
	debug \
	release \
	plus \
	syntax \
	doc \
	clean \
	clean-obj \
	clean-exe \
	clean-doc

.PHONY : $(DEFERRED_TARGETS)

$(DEFERRED_TARGETS) :
	@$(call defer,$(MAKEDIR)/Makefile.js.base)

