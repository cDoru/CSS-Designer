/*jslint es5: true, forin: true, indent: 4, plusplus: true, vars: true, regexp: true */
/*global define, window */

define(
	['Error', 'css_properties'],
	function (error, css_properties) {
		'use strict';

		var css_validator = {
			whats: []
		};

		css_validator.prototype.read = function (who, what, how) {
			this.whats = this.property_decompund(what, how);
			this.whats.forEach(this.validate);
			this.whats.filter(
				function (value) {
					return value === null;
				}
			);
		};

		// CSS-Sammlung (z.B.: font) oder Zusammenfassung (zB.: border-width) auflösen
		css_validator.prototype.property_decompund = function (what, how) {
			var i,
				expander,
				expanders = css_properties.compounds[what],
				props = [],
				all_compounds = function (expand_to, i, props) {
					if (expand_to[0] !== '\\') {
						what += '-' + expand_to;
					} else {
						what = expand_to.substr(1, expand_to.lenght - 1);
					}
					props[i] = [what, how];
				};
			if (!css_properties.compounds.hasOwnProperty(what)) {
				return [[what, how]];
			}

			// dieseRegEx kann die folgenden zusammengesetzten CSS-Werte richtig spalten:
			// "italic 15px 'Times New Roman', Times, serif"       -> ["italic",  "15px",     "'Times New Roman', Times, serif"]
			// "bullet outside url('http://url mit whitespace.com')" -> ["bullet",  "outside",  "url('http://url mit whitespace.com')"]
			how = how.match(/(url\(("[^"]*"|'[^']*')\)|((['"]\w+(\W+\w+)*['"]|\w+)(,\W+(['"]\w+(\W+\w+)*['"]|\w+))*)|\w+)/ig);
			expanders = css_properties.compounds[what];
			for (i = 0; i < how.length; i++) {
				// Vorarbeit für Zusammenfassungen abhängig von der Anzahl der Werte
				if (!expanders.hasOwnProperty(0)) {
					expander = expanders[how.length][i];
					if (typeof expander === 'string') {
						expander = [expander];
					}
				}
				expander.forEach(all_compounds);
				[].push(props, expander);
			}

			/* hier muss noch der font-size/line-height-hook rein */
			return props;
		};

		css_validator.prototype.validate = function (pair, index, whats) {
			var what = pair[0], how = pair[1];

			// property validierung
			if (!(css_properties.properties.hasOwnProperty(what) || css_properties.page_properties.hasOwnProperty(what))) {
				whats[index] = null;
				return null;
			}


			// value validierung

		};

		return css_validator;
	}
);