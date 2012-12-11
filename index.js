/*jslint es5: true, forin: true, indent: 4, plusplus: true, vars: true */
/*global define, window, requirejs */

requirejs.config(
	{
		baseUrl: './',
		paths: {
			'jquery': 'jquery-1.8.3',
			'jquery.ui': 'jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom'
		},
		shim: {
			'jquery.contextmenu': ['jquery'],
			'jquery.ui': ['jquery']
		}
	}

);

/*requirejs(
	['main'],
	function (start) {
		'use strict';

		start();
	}
);*/
requirejs(
	['css_definition'],
	function (def) {
		console.log(def);
	}
);