/*jslint es5: true, forin: true, indent: 4, plusplus: true, vars: true */
/*global define, window */

define(
	function () {
		'use strict';

		return function (message, function_name, function_arguments) {
			var text = "Error: " + message;
			if (function_name) {
				text += " in function " + function_name;
				if (function_arguments) {
					var tmp_text = JSON.stringify(function_arguments);
					text += "(" + tmp_text.substr(1, tmp_text.length - 2) + ")";
				}
			}
			return window.console.log(text);
		};
	}
);
