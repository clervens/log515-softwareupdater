const wmic = require('wmic-js');

module.exports = class ApplicationManager {
   static get(){
     return wmic().alias('product').find().get().catch((e) => {
      console.log('An error occurred while trying to fetch applications list\n'
          + 'Check if you\'re on the right OS (Windows only).');
    });
   }
 }
