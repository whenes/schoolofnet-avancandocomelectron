const { app, BrowserWindow, Tray, Menu, globalShortcut } = require('electron');
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

app.on('ready', createWindow);