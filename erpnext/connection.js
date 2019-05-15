require('dotenv').config();
const request = require('request');


var Connection = function() {
	this.cookie = "";
}

// Member methods will be here
Connection.prototype = {

	login: function() {
		return new Promise(async (resolve, reject) => {
			let cred = {
				usr: process.env.USERNAME,
				pwd: process.env.PASSWORD
			}
			try {
				let {
					response,
					body
				} = await this._post("login", cred);
				if(response.statusCode === 200) resolve(true);
				else {
					debug.log(response);
					reject(response);
				}
			} catch(e) {
				reject(e);
			}
		})

	},

	getReportJson: function(reportName, filters) {

		return new Promise(async (resolve, reject) => {
			try {
				let command = "frappe.desk.query_report.run?report_name=" + reportName;
				if(typeof filters != "undefined" && filters != null) {
					command += "&filters=" + JSON.stringify(filters);
				}
				let {
					response, body
				} = await this._get(command);
				if(response.statusCode === 200) resolve(JSON.parse(body));
				else {
					debug.log(response);
					reject(response);
				}
			} catch(e) {
				reject(e);
			}
		})

	},

	_get: function(command) {
		return new Promise((resolve, reject) => {
			request.post(this._makeUrl(command), (err, response, body) => {
				if(err) return reject(err);
				else if(response.statusCode != 200) return reject({response, body});
				else {
					this._setCookies(response);
					resolve({response, body});
				}
			});
		});
	},

	_post: function(command, data = {}) {
		return new Promise((resolve, reject) => {
			request.post(this._makeUrl(command), (err, response, body) => {
				if(err) return reject(err);
				else if(response.statusCode != 200) return reject({response, body});
				else {
					this._setCookies(response);
					resolve({response, body});
				}
			}).form(data);
		});
	},

	_makeUrl: function(command) {
		return {
			url: process.env.ERPNEXT_URL + "/api/method/" + command,
			headers: {
				Cookie: this.cookie
			}
		};
	},

	_setCookies: function(response) {
		let tmpCookie = response.headers['set-cookie'];
		let manCookie = cookie => cookie.split("; ").filter(item => !(/Expires=|Path=/.test(item))).join("");
		this.cookie = tmpCookie.map(manCookie).join("; ");
	}

}


module.exports = Connection;