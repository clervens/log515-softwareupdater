const path = require('path');
const mb = require('menubar')({
  transparent: true,
  preloadWindow: true,
  width: 340,
  height: 540,
  index: 'file://' + path.join(__dirname, 'index.html')
});

var fs = require("fs");
var content = fs.readFileSync("data.json");
var jsonContent = JSON.parse(content);

mb.on('ready', () => {
  console.log('Menubar electron app is ready');

    for(var i=0; i<jsonContent.length; i++) {
        console.log(jsonContent[i].Name);
    }
});

mb.on('window-all-closed', () => {
  mb.quit();
});