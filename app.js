const path = require('path');
const mb = require('menubar')({
  transparent: true,
  preloadWindow: true,
  width: 340,
  height: 540,
  index: 'file://' + path.join(__dirname, 'index.html')
});

mb.on('ready', () => {
  console.log('Menubar electron app is ready')
});

mb.on('window-all-closed', () => {
  mb.quit()
});