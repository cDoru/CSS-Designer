/*jslint es5: true, forin: true, indent: 4, plusplus: true, vars: true, regexp: true */
/*global define, window */

define(
	['Error', 'css_definition'],
	function (error, css_definition) {
		'use strict';

		var css_validator = {
			properties: [],
			selector: ''
		};

		css_validator.prototype.read = function (selector, property, value) {
			this.selector = selector;
			this.properties
				.concat(this.property_decompund(property, value))
				.filter(function (css) { return css_definition.properties.hasOwnProperty(css.property); })
				.filter(this.value_validate)
				.forEach(this.relativeFontSizeHook);
		};

		// CSS-Sammlung (z.B.: font) oder Zusammenfassung (zB.: border-width) auflösen
		css_validator.prototype.property_decompund = function (property, value) {
			var i,
				expander,
				expanders = css_definition.compounds[property],
				props = [],
				all_compounds = function (expand_to, i, props) {
					if (expand_to[0] !== '\\') {
						property += '-' + expand_to;
					} else {
						property = expand_to.substr(1, expand_to.lenght - 1);
					}
					props[i] = {property: property, value: value};
				};
			if (!css_definition.compounds.hasOwnProperty(property)) {
				return [{property: property, value: value}];
			}

			// dieseRegEx kann die folgenden zusammengesetzten CSS-Werte richtig spalten:
			// "italic 15px 'Times New Roman', Times, serif"       -> ["italic",  "15px",     "'Times New Roman', Times, serif"]
			// "bullet outside url('http://url mit whitespace.com')" -> ["bullet",  "outside",  "url('http://url mit whitespace.com')"]
			value = value.match(/(url\(("[^"]*"|'[^']*')\)|((['"]\w+(\W+\w+)*['"]|\w+)(,\W+(['"]\w+(\W+\w+)*['"]|\w+))*)|\w+)/ig);
			expanders = css_definition.compounds[property];
			for (i = 0; i < value.length; i++) {
				// Vorarbeit für Zusammenfassungen abhängig von der Anzahl der Werte
				if (!expanders.hasOwnProperty(0)) {
					expander = expanders[value.length][i];
					if (typeof expander === 'string') {
						expander = [expander];
					}
				}
				expander.forEach(all_compounds);
				[].push(props, expander);
			}
			return props;
		};

		// "entpackt" evtl. vorhandene font-size-line-height Angaben in die Eigenschaft font-size und line-height
		// siehe im Standard: http://www.w3.org/TR/2011/REC-CSS2-20110607/fonts.html#font-shorthand
		css_validator.prototype.relativeFontSizeHook = function (css, index, array) {
			var values;
			if ((css.property !== 'font-size-line-height') ||
					(css.value.search('/') !== -1) ||
					(css.value.match(new RegExp('/', 'g')).length > 1)) {
				return true;
			}
			values = css.value.split('/');
			array.splice(index, 1,
				{property: 'font-size',   value: values[0]},
				{property: 'line-height', value: values[0]}
				);
		};


		// prüft ob 'value' eine erlaubte Farbangabe im Funktionsformat (rgb|hsl)a?(…) ist
		css_validator.prototype.isColorFunction = function (value) {
			var match, values, prozent,
				notBetween = function (number, max, prozent) {
					if (prozent) {
						if (number[number.length] !== '%') { return false; }
						number = number.substr(0, number.length - 1);
						max = 100;
					}
					if (isNaN(Number(value[3])) ||
							(number > max) ||
							(number < 0)) {
						return false;
					}
				};

			match = value.strtolower().match(new RegExp('^(rgb|hsl)(a?)\\((.*)\\)$', 'i'));
			if (match === null) {
				return false;
			}
			values = match[3].split(',');

			// Transparenz
			if ((match[2] === 'a') && (notBetween(value[3], 1, false))) { return false; }

			// Farbwerte
			switch (match[1]) {
			case 'hsl':
				if (notBetween(value[0], 360, false) ||
						notBetween(value[1], 100, true) ||
						notBetween(value[2], 100, true)) { return false; }
				return true;
			case 'rgb':
				prozent = (value[0][value[0].length] !== '%');
				if (notBetween(value[0], 255, prozent) ||
						notBetween(value[1], 255, prozent) ||
						notBetween(value[2], 255, prozent)) { return false; }
				return true;
			}
		};

		// prüft ob 'css.value' eine gültige Manifestation der zusammengesetzten CSS Angabe 'compound' ist
		css_validator.prototype.value_validate_compound = function (css, compound) {
			var partnumber, tmp_css = {}, cursor = 0, subcursor, splitting = {};
			for (partnumber in compound) {
				if (compound[partnumber][0] !== '$') {
					if (css.value.substr(cursor, compound[partnumber][0].length) !== compound[partnumber][0]) {
						return false;
					}
					cursor += compound[partnumber][0].length;
				} else {
					subcursor = 1;
					tmp_css = {
						'valueclass': compound[partnumber].substr(1),
						'value': css.value.substr(cursor, subcursor)
					};
					// so lange weiterrücken bis ein erlaubter Wert enthalten ist
					while (!this.value_validate_class(tmp_css.value, tmp_css.valueclass)) {
						subcursor++;
						if (cursor + subcursor > css.value.length) {
							return false;
						}
						tmp_css.value = css.value.substr(cursor, subcursor);
					}
					// so lange weiterrücken bis kein erlaubter Wert mehr enthalten ist
					while (this.value_validate_class(tmp_css.value, tmp_css.valueclass)) {
						subcursor++;
						if (cursor + subcursor > css.value.length) {
							return false;
						}
						tmp_css.value = css.value.substr(cursor, subcursor);
					}
					// ein Zeichen zurückspringen und den letzten gültigen Wert verwenden
					subcursor--;
					tmp_css.value = css.value.substr(cursor, subcursor);
					this.value_validate_class(tmp_css.value, tmp_css.valueclass);
					splitting[partnumber] = tmp_css;
					cursor += subcursor;
				}
			}
			css.valueclass.push(splitting);
			return true;
		};

		// prüft ob 'css.value' ein gültiges Element der Werteklasse 'valueclass' (zum Beispiel 'Farbe') ist
		css_validator.prototype.value_validate_class = function (css, valueclass) {
			css.valueclass.push(valueclass);
			var regEx, subclass, part;
			switch (valueclass) {
			// interne Klasen
			case 'NUMERICAL':
				return !isNaN(Number(css.value));
			case 'INTEGER':
				return (String(parseInt(css.value, 10)) === css.value);
			case 'URI':
				// regEx = /^([a-z0-9+.-]+):(?://(?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(\d*))?(/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?|(/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?$/i;
				regEx = new RegExp('^[^)]*$');
				return regEx.test(css.value);
			case 'FONTS':
				regEx.FONT = '(\'[^\']*\'|"[^"]*"|\\w)'; // gequoteter String oder Wort
				regEx = new RegExp('^' + regEx.FONT + '(,\\W*' + regEx.FONT + ')*$');
				return regEx.test(css.value);
			case 'ABSOLUTCOLOR':
				regEx = new RegExp('^#([0-9a-fA-F]{3}){1,2}$');
				if (regEx.test(css.value)) {
					return true;
				}
				return this.isColorFunction(css.value);
			// Subklassen
			default:
				subclass = css_definition.valueclass[valueclass];
				if (subclass.hasOwnProperty(0)) {
					return this.value_validate_array(css, subclass);
				}
				return this.value_validate_compound(css, subclass);
			}
		};

		// prüft ob 'css.value' gültig im Sinne eines der konkreten Wert oder Werteklassen in 'array' ist
		css_validator.prototype.value_validate_array = function (css, array) {
			var i, allowed_value;
			for (i = 0; i < array.length; i++) {
				if (allowed_value[0] !== '$') {
					if (css.value === allowed_value) {
						return true;
					}
				} else {
					if (this.value_validate_class(css.value, allowed_value.substr(1))) {
						return true;
					}
				}
			}
			return false;
		};

		// prüft ob 'css.value' ein gültiger CSS Wert der Eigenschaft 'css.property' ist
		css_validator.prototype.value_validate = function (css, index, whats) {
			var allowed = css_definition.properties[css.property];
			css.valueclass = [];

			// Liste erlaubter Werte und Klassen
			if (typeof allowed === "object") {
				return this.value_validate_array(css, allowed);
			}
			// Klasse erlaubter Werte
			return this.value_validate_class(css, allowed.substr(1));
		};

		return css_validator;
	}
);