require('dotenv').config();

// Some bootstrapping tasks
require('./bootstrap')();

// Actual function call
(async function() {

  // Collect all the Required dependancies
  var Connection = require("./erpnext/connection");
  var file       = require("./file/maker")
  var Data       = require("./data/salary-format");
  var erpConf    = require("./erpnext/config.js");
  var fileConf   = require("./file/config.js");

  // Create new connection to ERP Next
  var connection = new Connection;

  try {
    var login = await connection.login();
    if(login === true) {
      let json = await connection.getReportJson(erpConf.report, erpConf.filters);
      file.saveFormat(fileConf.format, json, erpConf.filters);
      debug.log("File '" + filename + "' has been generated succesfully.");
    } else {
      console.error("Could not logged in to your ERP Next, please check credentials.");
    }
  } catch(e) {
    debug.log(e);
  }

})();
