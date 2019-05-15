require('dotenv').config();

global.debug = {
	log: function(str) {
		if(process.env.DEBUG == 'true') {
			console.log(str);
		}
	}
};

function getMonth() {
	let month = 'May';
	if(process.argv.length > 2) {
		let possibleMonth = process.argv[2];
		let listOfMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		if(listOfMonths.indexOf(possibleMonth) != -1) return possibleMonth;
	}
	return month;
}

(async function() {

	var Connection = require("./erpnext/connection");
	var file = require("./file/maker")
	var Data = require("./data/salary-format");
	var connection = new Connection;

	var month = getMonth();

	try {
		var login = await connection.login();
		var login = true;
		if(login === true) {
			let json = await connection.getReportJson('Employee Payout', {month});
			let data = Data.convert(json, month);
			let filename = "Salary of " + month + ".txt";
			file.make(filename, 'icici-salary-format', {data});
			debug.log("File '" + filename + "' has been generated succesfully.");
		}
	} catch(e) {
		debug.log(e);
	}

})();
