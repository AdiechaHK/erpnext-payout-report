require('dotenv').config();

function convert(json, {month}) {
	let arrToObj = list => {
		let fields = ['ac_no', 'currency', 'branch', 'type', 'salary', 'particular'];
		return list.reduce((json, value, index) => {
			if(fields.length > index) {
				json[fields[index]] = value;
			}
			return json;
		}, {});
	}

	let result = json.message.result;

	let total = result.map(row => row[4]).reduce((ttl, amt) => ttl + amt, 0);

	companyRow = [
		process.env.COMPANY_AC_NO,
		process.env.CURRENCY,
		process.env.BRANCH_CODE,
		"D", total, "Salary for " + month
	];

	result = [ companyRow, ...result ];

	return {data: result.map(arrToObj)};
}

module.exports = convert;