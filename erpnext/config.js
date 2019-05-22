require('dotenv').config();

function getReportName() {
  return opts.report || process.env.ERPNEXT_REPORT_NAME;
}

function getFilters() {
  return opts.filter;
}

module.exports = {
  report: getReportName(),
  filters: getFilters()
}