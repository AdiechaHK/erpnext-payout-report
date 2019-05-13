const ERPNext = require("./erpnext/app.js");
const TextFile = require("./format-text-file/app.js");
const format = require("./formats/standard-icici-format.json");

let month = months[date.getMonth()];
let year  = date.getFullYear();

let app = new ERPNext();
let report = app.getReport("employee-payout");
TextFile.format(report, format);
