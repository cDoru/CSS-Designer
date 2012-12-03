/*jslint es5: true, forin: true, indent: 4, plusplus: true, vars: true */
/*global define, window, requirejs */

define(
	['Error', 'Css_Editor_Core', 'jquery', 'jquery.contextmenu', 'jquery.ui'],
	function (error, Css_Editor_Core, $) {
		'use strict';

		var CE = new Css_Editor_Core(
				function (element, property, value) {
					return $(element).css(property, value);
				}
			),

			addTemplate = "<div id='addCSS'>" +
				 "<label for='element'>Element</label> <input type='text' id='element' name='element' /><br />" +
				 "<label for='property'>Property</label> <input type='text' id='property' name='property' /><br />" +
				 "<label for='value'>Value</label> <input type='text' id='value' name='value' />" +
				 "</div>",

			add = function () {
				return $('#addCSS').dialog('open');
			},

			print = function (CE) {
				return function () {
					window.console.log(CE.toString());
				};
			},

			contextmenu = [
				{'add': add},
				{'print': print(CE)}
			],

			dialog = {
				autoOpen: false,
				height: "250",
				width: "350",
				modal: true,
				buttons: {
					"Set": function () {
						CE.add(
							$('#element').val(),
							$('#property').val(),
							$('#value').val()
						);
						$(this).dialog("close");
						CE.draw();
					},
					"Clear": function () {
						$([]).add('#element').add('#property').add('#value').empty();
					}
				}
			},

			run_when_ready = function () {
				$('body').contextMenu(contextmenu);
				$('body').append(addTemplate);
				$('#addCSS').dialog(dialog);
			};

		return function () {
			$('document').ready(
				run_when_ready
			);
		};
	}
);