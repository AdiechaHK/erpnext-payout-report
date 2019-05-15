const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
require("./helpers")(Handlebars);

Handlebars.registerHelper("fixedSize", function(text, size, align) {
	if(typeof text != "undefined" && text.length > 0 && !isNaN(Number(size))) {
		align = typeof align == 'string'? align: 'left';

		if(typeof text == "number") {
			text = Number(text).toFixed(2);
		} else if(typeof text != "string") return "[fixedSize Not Applicatble on " + typeof text + "]";

		if(text.length > size) return text.substr(0, size);
		else {
			let spaces = (new Array(size - text.length)).join(" ");
			if(align === 'right') return spaces + text;
			if(align === 'left') return text + spaces;
		}
	} else (new Array(size)).join(" ");
})

Handlebars.registerHelper("decPoint", function(number, accuracy) {
	if(typeof number != "undefined" && !isNaN(Number(number)) && !isNaN(Number(accuracy))) {
		return Number(number).toFixed(accuracy)
	} else "";
})

function make(newFileName, formatName, data) {
	try {
		let templateText = fs.readFileSync(path.join(__dirname, "./formats/" + formatName + ".format"), 'utf8');
		let template = Handlebars.compile(templateText);
		var text    = template(data);
		fs.writeFileSync(path.join(__dirname, "./outputs/" + newFileName), text);
	} catch(e) {
		debug.log(e);
	}
}

module.exports = {
	make
}