/*jslint es5: true, forin: true, indent: 4, plusplus: true, vars: true, regexp: true */
/*global */
var requirejs = require('requirejs');
// var jquery = require('jquery');

requirejs.config(
	{
		paths: {
			'jquery.ui': 'jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom'
		},
		shim: {
			'jquery.contextmenu': ['jquery'],
			'jquery.ui': ['jquery']
		},

		//Pass the top-level main.js/index.js require
		//are loaded relative to the top-level JS file.
		nodeRequire: require
	}
);

$.support.cors = true;
		$.ajaxSettings.xhr = function () {
			return new (require("xmlhttprequest").XMLHttpRequest);
		}

		


requirejs(
	['css_definition'],
	function (css_definition) {
		'use strict';
		console.log(css_definition);
	}
);
