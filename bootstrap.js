const stdio = require('stdio');

module.exports = function () {

  global.debug = {
    log: function(str) {
      if(process.env.DEBUG == 'true') {
        console.log(str);
      }
    }
  };

  let options = stdio.getopt({
    'report': {
      key: 'r',
      args: 1,
      description: 'Name of the report (which you set in your erp next)'
    },
    'format': {
      key: 'ff',
      args: 1,
      description: 'Name of the file format to use to generate output file.'
    },
    'filter': {
      key: 'f',
      description: 'Colon saperated key value pair.',
      multiple: true
    }
  });

  let { report, filter } = options;

  let splitFilter = function(list) {
    const filterReducer = (json, fltr) => {
      let i = fltr.indexOf(':');
      if(i !== -1) {
        let key = fltr.substr(0, i);
        let val = fltr.substr(i + 1);
        json[key] = val;
      }
      return json;
    };

    if(typeof list  === 'object' && list.constructor.name === [].constructor.name) {

      return list.reduce(filterReducer, {});
    } else if(typeof list === 'string') return filterReducer({}, list);
    else return {};
  }

  global.opts = { report, filter: splitFilter(filter) };


  global.appDir = __dirname;

}
