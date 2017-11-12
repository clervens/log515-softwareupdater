const path = require('path');
const { globalShortcut } = require('electron');
const mb = require('menubar')({
  transparent: true,
  preloadWindow: true,
  width: 340,
  height: 540,
  index: 'file://' + path.join(__dirname, 'views', 'index.html')
});

mb.on('ready', () => {
  console.log('Menubar electron app is ready');
  globalShortcut.register('CommandOrControl+R', () => {
    mb.window.reload();
  });
});

mb.on('window-all-closed', () => {
  mb.quit()
});