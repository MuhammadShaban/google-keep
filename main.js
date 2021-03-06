const { app, BrowserWindow, screen } = require('electron');
const { join } = require('path');

let win = null;
const args = process.argv.slice(1);
const isDevMode = process.execPath.match(/[\\/]electron/);
const serve = args.some(val => val === '--serve');
const { name, version } = require('./package.json');

function createWindow() {

    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    win = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        icon: join(__dirname, './icons/icon.png'),
        title: 'Google Keep',
        titleBarStyle: 'hiddenInset',
        autoHideMenuBar: !isDevMode,
        webPreferences: {
            nodeIntegration: false,
            webSecurity: true,
            allowRunningInsecureContent: false,
            enableRemoteModule: false
        }
    });

    win.loadURL('https://keep.google.com?hl=en', { userAgent: 'Chrome' });

    if (!isDevMode) win.setMenu(null);
    if (serve) win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    return win;
}

try {

    app.userAgentFallback = app.userAgentFallback
        .replace(`Electron/${process.versions.electron} `, '')
        .replace(`${name}/${version} `, '');
    app.allowRendererProcessReuse = true;

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });

} catch (e) {
    // Catch Error
    // throw e;
}
