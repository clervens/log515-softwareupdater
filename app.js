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

mb.on('ready', () => {
  console.log('Menubar electron app is ready');
  globalShortcut.register('CommandOrControl+R', () => {
    mb.window.reload();
  });
});

mb.on('window-all-closed', () => {
  mb.quit();
});
