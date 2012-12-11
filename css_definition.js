/*jslint es5: true, forin: true, indent: 4, plusplus: true, vars: true, regexp: true */
/*global define, window */

define(
	['jquery'],
	function ($) {
		'use strict';

		$.support.cors = true;
		$.ajaxSettings.xhr = function () {
			return new (require("xmlhttprequest").XMLHttpRequest);
		}

		var url = 'http://localhost/CSS-Designer/CSSproperties.json';
		url = 'CSSproperties.json';
		return JSON.parse($.ajax(url, {async: false})
				.responseText
				.replace(/\/\*(.|\n)*\*\//m, '')
				.replace(/\/\/.*\n/mg, ''));
	}
);
