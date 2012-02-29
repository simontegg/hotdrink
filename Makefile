# Umbrella Makefile.

include Makefile.common

##################################################
# targets

.PHONY : all debug release plus syntax doc parser dijit test

all :
	@$(call defer,Makefile.lib)

debug :
	@$(call defer,Makefile.lib)

release :
	@$(call defer,Makefile.lib)

plus :
	@$(call defer,Makefile.lib)

syntax :
	@$(call defer,Makefile.lib)

doc :
	@$(call defer,Makefile.lib)

parser :
	@$(MAKE) -f Makefile.parser

dijit :
	@$(MAKE) -f Makefile.dijit

test :
	@$(MAKE) -f Makefile.test

##################################################
# cleaning

.PHONY : clean clean-obj clean-exe clean-test clean-doc

clean : clean-obj clean-exe

clean-obj :
	@$(call defer,Makefile.lib)
	@$(call defer,Makefile.parser)
	@$(call defer,Makefile.dijit)

clean-exe :
	@$(call defer,Makefile.lib)
	@$(call defer,Makefile.parser)
	@$(call defer,Makefile.dijit)

clean-test :
	@$(call defer,Makefile.test)

clean-doc :
	@$(call defer,Makefile.lib)
	@$(call defer,Makefile.parser)

