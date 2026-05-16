const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const Store = require('electron-store');

require('./rpc');
require('./updater');

const store = new Store();

let mainWindow;
let splashWindow;

function createSplash() {
    splashWindow = new BrowserWindow({
        width: 500,
        height: 300,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        show: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    splashWindow.loadFile(path.join(__dirname, 'pages', 'splash.html'));
}

function createMainWindow() {

    mainWindow = new BrowserWindow({
        width: 1500,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        show: false,
        title: 'Zuvano',
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets', 'icon.ico'),

        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: true
        }
    });

    // Zuvano laden
    mainWindow.loadURL('https://zuvano.eu/login.php');

    // Externe Links im Browser öffnen
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {

        shell.openExternal(url);

        return {
            action: 'deny'
        };

    });

    // Splash schließen
    mainWindow.once('ready-to-show', () => {

        setTimeout(() => {

            if (splashWindow) {
                splashWindow.close();
            }

            mainWindow.show();

        }, 2000);

    });

    // DevTools blockieren
    mainWindow.webContents.on('before-input-event', (event, input) => {

        if (
            input.control &&
            input.shift &&
            input.key.toLowerCase() === 'i'
        ) {
            event.preventDefault();
        }

    });

}

function showLicenseWindow() {

    const licenseWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        autoHideMenuBar: true,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    licenseWindow.loadFile(
        path.join(__dirname, 'pages', 'license.html')
    );

    ipcMain.once('licenseAccepted', () => {

        store.set('acceptedLicense', true);

        licenseWindow.close();

        createSplash();
        createMainWindow();

    });

}

app.whenReady().then(() => {

    const accepted = store.get('acceptedLicense');

    if (!accepted) {

        showLicenseWindow();

    } else {

        createSplash();
        createMainWindow();

    }

});

app.on('window-all-closed', () => {

    if (process.platform !== 'darwin') {
        app.quit();
    }

});