const helpers = {
  fixedSize: function(text, size) {
    return text.length > size ? text.substr(0, size): text;
  }
};

function initHelpers(hBars) {
  for (name in Object.keys(helpers)) {
    hBars.registerHelper(name, helpers[name]);
  }
}

module.exports = initHelpers;