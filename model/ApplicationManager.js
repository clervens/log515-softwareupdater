const wmic = require('wmic-js');

module.exports = class ApplicationManager {
   static get(){
     console.log("in get");
     return wmic().alias('product').find().get();
   }
 }
