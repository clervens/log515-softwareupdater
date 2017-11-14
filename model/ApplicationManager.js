const wmic = require('wmic-js');

module.exports = class ApplicationManager {
  static get(){
    //TODO add merge with the new information about the update
    if (process.platform == 'darwin')
      return Promise.resolve([{
        Name: "123 app technique.",
        Version: "2.3.4.5.2.4"
      }]);
    return wmic().alias('product').find().get().catch((e) => {
      console.log('An error occurred while trying to fetch applications list\n'
          + 'Check if you\'re on the right OS (Windows only).');
    });
  }
}
