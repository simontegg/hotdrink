namespace.open('hottest.adam');

hottest.adam.basic =
 	['sheet circle {',
   '  constant : {',
   '    pi: 3.14;',
   '  }',
   '  input : {',
   '    radius: 10;',
   '  }',
	 '	interface: {',
	 '		diameter;',
	 '	}',
	 '	logic: {',
	 '		relate {',
	 '			radius <== diameter / 2;',
	 '			diameter <== radius * 2;',
	 '		}',
	 '	}',
	 '	output: {',
	 '		result <== pi * radius * radius;',
	 '	}',
	 '}'
	].join('\n');
