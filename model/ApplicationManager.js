const wmic = require('wmic-js'),
    merge = require('merge');

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

  //TODO: we use only json to mock the database
  static getUpdateInformation(applicationName){
    let data = require('../data.json');
    for(let i=0; i < data.length; i++){
      let el = data[i];
      if(el.Name === applicationName){
        return Promise.resolve(merge({
          getUrl: function(platform, arch){
            for(let y=0; y<el.Source.length; y++){
              let src = el.Source[y];
              if(src.platform == platform && src.processorType == arch){
                return src.url;
              }
            }
            return null;
          }
        }, el));
      }
    }
    return Promise.resolve(null);
  }
}
