const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();

autoUpdater.on('update-available', () => {
  console.log('Update gefunden');
});

autoUpdater.on('update-downloaded', () => {
  console.log('Update heruntergeladen');
});