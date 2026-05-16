const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');

autoUpdater.checkForUpdatesAndNotify();

autoUpdater.on('checking-for-update', () => {
    console.log('Suche nach Updates...');
});

autoUpdater.on('update-available', () => {

    console.log('Update gefunden');

    dialog.showMessageBox({
        type: 'info',
        title: 'Zuvano Update',
        message: 'Ein neues Update wird heruntergeladen.'
    });

});

autoUpdater.on('update-not-available', () => {
    console.log('Keine Updates gefunden');
});

autoUpdater.on('download-progress', (progressObj) => {

    let percent = Math.round(progressObj.percent);

    console.log('Download: ' + percent + '%');

});

autoUpdater.on('update-downloaded', () => {

    dialog.showMessageBox({
        type: 'info',
        title: 'Update bereit',
        message: 'Update installiert sich nach Neustart.'
    }).then(() => {

        autoUpdater.quitAndInstall();

    });

});

autoUpdater.on('error', (err) => {

    console.log('Updater Fehler:', err);

});