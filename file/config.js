require('dotenv').config();

function getFormat() {
  return opts.format || process.env.FORMAT_NAME;
}

module.exports = {
  format: getFormat()
};