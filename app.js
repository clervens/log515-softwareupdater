const path = require('path');
const { globalShortcut } = require('electron');
const mb = require('menubar')({
  transparent: true,
  preloadWindow: true,
  width: 340,
  height: 540,
  index: 'file://' + path.join(__dirname, 'views', 'index.html'),
  icon: path.join(__dirname, 'assets', 'img', 'if_cat_upsidedown_185521.png')
});

var fs = require("fs");
var content = fs.readFileSync("data.json");
var jsonContent = JSON.parse(content);

mb.on('ready', () => {
  console.log('Menubar electron app is ready');
  globalShortcut.register('CommandOrControl+R', () => {
    mb.window.reload();
  });

    for(var i=0; i<jsonContent.length; i++) {
        console.log(jsonContent[i].Name);
    }
});

mb.on('window-all-closed', () => {
  mb.quit();
});
