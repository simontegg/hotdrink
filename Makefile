# Umbrella Makefile.

MAKEDIR := make
export MAKEDIR
include $(MAKEDIR)/Makefile.common

##################################################
# targets

.PHONY : all debug release plus syntax doc parser dijit test

all :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

debug :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

release :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

plus :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

syntax :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

doc :
	@$(call defer,$(MAKEDIR)/Makefile.lib)

parser :
	@$(MAKE) -f $(MAKEDIR)/Makefile.parser

dijit :
	@$(MAKE) -f $(MAKEDIR)/Makefile.dijit

test :
	@$(MAKE) -f $(MAKEDIR)/Makefile.test

##################################################
# cleaning

.PHONY : clean clean-obj clean-exe clean-test clean-doc

clean : clean-obj clean-exe clean-test

clean-obj :
	@$(call defer,$(MAKEDIR)/Makefile.lib)
	@$(call defer,$(MAKEDIR)/Makefile.parser)
	@$(call defer,$(MAKEDIR)/Makefile.dijit)

clean-exe :
	@$(call defer,$(MAKEDIR)/Makefile.lib)
	@$(call defer,$(MAKEDIR)/Makefile.parser)
	@$(call defer,$(MAKEDIR)/Makefile.dijit)

clean-test :
	@$(MAKE) -f $(MAKEDIR)/Makefile.test clean

clean-doc :
	@$(call defer,$(MAKEDIR)/Makefile.lib)
	@$(call defer,$(MAKEDIR)/Makefile.parser)

