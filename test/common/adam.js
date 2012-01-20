namespace.open('hottest.adam');

hottest.adam.basic =
 	['sheet circle {',
	 '	interface: {',
	 '		radius: 10;',
	 '		diameter;',
	 '	}',
	 '	logic: {',
	 '		relate {',
	 '			radius <== diameter / 2;',
	 '			diameter <== radius * 2;',
	 '		}',
	 '	}',
	 '	output: {',
	 '		result <== radius;',
	 '	}',
	 '}'
	].join('\n');
