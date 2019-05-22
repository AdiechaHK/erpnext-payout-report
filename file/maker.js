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

function _getFormatPath(formatName) {
  let formatPath = path.join(appDir, 'formats', formatName, 'format.txt');
  formatPath     = fs.existsSync(formatPath)? formatPath: path.join(__dirname, 'default/format.txt');
  return formatPath;
}

function _make(newFileName, formatName, data) {
  try {
    let templateText = fs.readFileSync(_getFormatPath(formatName), 'utf8');
    let template     = Handlebars.compile(templateText);
    var text         = template(data);
    fs.writeFileSync(path.join(appDir, "./outputs/" + newFileName), text);
  } catch(e) {
    debug.log(e);
  }
}

function _filename(fileName, filters = {}) {
  var basic = {
    CURRENT_TIMESTAMP: (new Date).getTime()
    // ... 
    // We can add as many static fields that can help to build name as we want
  }
  return Handlebars.compile(fileName)({...basic, ...filters});
}

function _getConfig(formatName) {
  let configPath = path.join(appDir, 'formats', formatName, 'config.js');
  configPath     = fs.existsSync(configPath)? configPath: path.join(__dirname, 'default/config.js');
  return require(configPath);
}


function _getDataConverterFunction(formatName) {
  let filePath = path.join(appDir, 'formats', formatName, 'data-converter.js');
  filePath     = fs.existsSync(filePath)? filePath: path.join(__dirname, 'default/data-converter.js');
  return require(filePath);
}


function saveFormat(formatName, data, filters) {
  if(typeof formatName !== 'string') return console.error("Format needs to be specify correctly.");
  if(fs.existsSync(path.join(appDir, 'formats', formatName))) {

    let config   = _getConfig(formatName);
    let convert  = _getDataConverterFunction(formatName);
    let fileName = _filename(config.filename, filters);

    _make(fileName, formatName, convert(data, filters));

  } else console.error(`Doesn't configured this format [{formatName}]`);
}

module.exports = { saveFormat }