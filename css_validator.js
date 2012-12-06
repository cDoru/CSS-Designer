/*jslint es5: true, forin: true, indent: 4, plusplus: true, vars: true */
/*global define, window */

define(
	['Error', 'css_properties'],
	function (error, css_properties) {
		'use strict';

		var css_validator = {};

		this.css_validator = function (who, what, how) {
			return window.console.log("Hallo");
		};

		this.validate_property = function (what, how) {
			var i, prop = {}, props = [], expanders;
			if (css_properties.properties.hasOwnProperty(what) || css_properties.page_properties.hasOwnProperty(what)) {
				prop[what] = how;
				props.append(prop);
				return props;
			}
			if (css_properties.compounds.hasOwnProperty(what)) {
				expanders = css_properties.compounds[what];
				if (expanders.hasOwnProperty(0) !== "string") {
					expanders = expanders[how.split(' ').length];
				}
				for (i = 0; i < expanders.length; i++) {
					props.append(this.expand_property(what, expanders[i], how));
				}
				return props;
			}
		};

		return css_validator;
	}
);