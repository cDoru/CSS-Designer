/*jslint es5: true, forin: true, indent: 4, plusplus: true, vars: true */
/*global define, window */

define(
	['Error'],
	function (error) {
		'use strict';

		var Css_Editor_Core = function (draw_property, property_list) {
			this.draw_property = draw_property;

			/*
			property_list should have this structure:
			property_list = {
				{'who': 'css-selector', 'what': property_dict},
				…
			}
			property_dict = {
				'css_property': 'css_value',
				…
			}
			*/
			this.property_list = property_list || [];
		};

		Css_Editor_Core.prototype.add = function (who, css_property, css_value) {
			var i;
			for (i = 0; i < this.property_list.length; i++) {
				if (this.property_list[i].who === who) {
					if (this.property_list[i].what.hasOwnProperty(css_property)) {
						error("Property <" + css_property + "> already set for element <" + who + ">", 'add', arguments);
						return false;
					}
					this.property_list[i].what[css_property] = css_value;
					return true;
				}
			}
			this.property_list[i] = {
				'who': who,
				'what': {}
			};
			this.property_list[i].what[css_property] = css_value;
			return true;
		};

		Css_Editor_Core.prototype.remove = function (who, css_property) {
			var i;
			for (i = 0; i < this.property_list.length; i++) {
				if (this.property_list[i].who === who) {
					if (this.property_list[i].what.hasOwnProperty(css_property)) {
						delete this.property_list[i].what[css_property];
						return true;
					}
					error("Can't find property <" + css_property + "> in element <" + who + ">", 'remove', arguments);
					return false;
				}
			}
			error("Can't find element <" + who + ">", 'remove', arguments);
			return false;
		};

		Css_Editor_Core.prototype.edit = function (who, css_property, css_value) {
			return this.remove(who, css_property) && this.add(who, css_property, css_value);
		};

		Css_Editor_Core.prototype.draw_element = function (element) {
			var css_property,
				selector = element.who,
				property_dict = element.what;
			for (css_property in property_dict) {
				this.draw_property(selector, css_property, property_dict[css_property]);
			}
		};

		Css_Editor_Core.prototype.draw = function () {
			this.property_list.forEach(this.draw_element, this);
			return true;
		};

		Css_Editor_Core.prototype.element_toString = function (element) {
			var i = 0,
				css_property,
				text_properties = [],
				property_dict = element.what;
			for (css_property in property_dict) {
				text_properties[i] = css_property + ": " + JSON.stringify(property_dict[css_property]) + ";\n";
				i++;
			}
			return element.who + " {\n\t" + text_properties.join("\t") + "}\n";
		};

		Css_Editor_Core.prototype.toString = function () {
			var i, text_elements = [];
			for (i = 0; i < this.property_list.length; i++) {
				text_elements[i] = this.element_toString(this.property_list[i]);
			}
			return text_elements.join("\n");
		};

		return Css_Editor_Core;
	}
);