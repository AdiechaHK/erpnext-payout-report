const request = require('request');
const fs = require('fs');

const resp = function(requestName, extCb = null) {
	return function(err, response, body) {
		console.log("Got response of " + requestName);
		if(extCb != null) extCb(err, response, body);
		if(err) return console.log("Error:: ", err);
		return console.log("Success:: ", response.statusCode);
	}
}

const cred = {
	usr: "Administrator",
	pwd: "admin"
};

var month = "May";

request.post('http://localhost:8000/api/method/login', resp("Login", function(err, resposne, body) {
	

	let cookie = resposne.headers['set-cookie'];
	let manCookie = function(cookie) {
		return cookie.split("; ").filter(item => !(/Expires=|Path=/.test(item))).join("");
	}

	cookie = cookie.map(manCookie).join("; ");

	request.get({
		url: 'http://localhost:8000/api/method/frappe.desk.query_report.run?report_name=Employee Payout&filters=' + JSON.stringify({month}),
		headers: {
			Cookie: cookie
		}
	}, resp("Report Details", function(err, response, body) {
		let json = JSON.parse(body);
		let formatField = (field, index) => {
			let sizing = (input, size) => {
				let right = false;
				let space = "";
				if(typeof input == "number") {
					right = true;
					input = input.toFixed(2);
				}
				if(typeof input != "string") return (new Array(size)).join(" ");
				if(size > input.length) {
					space += (new Array(size - input.length)).join(" ");
				}
				return (right?space:"") + (input) + (right?"":space);
			}
			return sizing(field, ([12,3,4,1,15,30])[index]);
		}
		let text = json.message.result.map(row => row.map(formatField).join("")).join("\n");
		fs.writeFile("output.txt", text);
	}));
})).form(cred);
