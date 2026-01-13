var fs = require("fs");
var Handlebars = require("handlebars");
var countries = require('./resources/countryCodes.json');

function render(resume) {
	var template = fs.readFileSync(__dirname + "/resume.template", "utf-8");

	var printCSS = fs.readFileSync(__dirname + "/css/print.css", "utf-8");
	var standardCSS = fs.readFileSync(__dirname + "/css/style.css", "utf-8");
	var screenCSS = fs.readFileSync(__dirname + "/css/screen.css", "utf-8");

	// JSON Resume uses `basics.url`; this theme historically used `basics.website`.
	if (resume && resume.basics && !resume.basics.website && resume.basics.url) {
		resume.basics.website = resume.basics.url;
	}

	// Get a country from the country code when location exists.
	if (resume && resume.basics && resume.basics.location && resume.basics.location.countryCode) {
		resume.basics.location.country = countries[resume.basics.location.countryCode];
	}

	// http://stackoverflow.com/a/31632215/838789
	Handlebars.registerHelper({
			and: function (v1, v2) {
					return v1 && v2;
			},
			eq: function (v1, v2) {
					return v1 === v2;
			},
			or: function (v1, v2) {
					return v1 || v2;
			}
	});

	// http://stackoverflow.com/a/18831911
	Handlebars.registerHelper('commalist', function(items, options) {
		return options.fn(items.join(', '));
	});

	// Send all necessary resources to the handlebars template and compile it
	return Handlebars.compile(template)({
		resume: resume,
		standardCSS: standardCSS,
		printCSS: printCSS,
		screenCSS: screenCSS
	});
}

module.exports = {
	render: render
};
