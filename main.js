const { app, BrowserWindow, Tray, Menu, globalShortcut, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const url = require('url');
const path = require('path');
const http = require('http');

if (process.env.NODE_ENV == 'development') {
  require('electron-reload')(__dirname);
}

app.setAppUserModelId('com.schoolofnet.electron-curso');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600, webPreferences: { nodeIntegration: true, enableRemoteModule: true, contextIsolation: false } });
  let file = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  });
  console.log(file);
  mainWindow.loadURL(file);

  if (process.env.NODE_ENV == 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('maximize', () => console.log('maximizado'));
  mainWindow.on('unmaximize', () => console.log('restaurado'));
  mainWindow.on('minimize', () => console.log('minimizado'));
  mainWindow.on('restore', () => console.log('desminimizado'));
  mainWindow.on('close', () => console.log('fechado'));
  mainWindow.on('resize', () => console.log('tamanho alterado'));

  let contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar aplicativo', 
      click: function() {
        mainWindow.show();
      }
    },
    {
      label: 'Sair', 
      click: function() {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  let tray = new Tray(path.join(__dirname, 'tray.png'));
  tray.setContextMenu(contextMenu);

  mainWindow.on('minimize', function(e) {
    e.preventDefault();
    mainWindow.hide();

  });

  mainWindow.on('close', function(e) {
    e.preventDefault();
    if (!app.isQuiting) {
      mainWindow.hide();
      return;
    }
    mainWindow.close();
  });

  tray.on('click', function() {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  tray.on('show', function() {
    tray.setHighlightMode('always');
  });

  globalShortcut.register('CommandOrControl+X', function() {
    console.log('Atalho global Ctrl+X');
  });

  globalShortcut.register('Alt+A', function() {
    console.log('Atalho global Alt+A');
  });
}

function senStatusToWindow(text) {
  const dialogOpts = {
    type: 'info',
    buttons: ['OK'],
    title: 'Atualização do aplicativo',
    message: 'Detalhes:',
    detail: text
  };
  dialogOpts.showMessageBox(dialogOpts);
}

autoUpdater.on('checking-for-update', () => {
  senStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', (info) => {
  senStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', (info) => {
  senStatusToWindow('Update note available.');
});
autoUpdater.on('error', (err) => {
  senStatusToWindow('Error in auto-updater.' + err);
});
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Downoad speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded' + progressObj.percent + '%';
  log_message = log_message + '(' + progressObj.transferred + '/' + progressObj.total;
  senStatusToWindow(log_message);
});
autoUpdater.on('update-downloaded', (info) => {
  senStatusToWindow('Update downloaded.');
});

app.on('ready', function() {
  autoUpdater.checkForUpdatesAndNotify();
  createWindow();
});