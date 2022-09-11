const path = require('path');
const Mousetrap = require('mousetrap');
const { remote } = require('electron');
const mainWindow = remote.BrowserWindow.getFocusedWindow();

const minimizar = document.getElementById("minimizar");
minimizar.addEventListener('click', function(e) {
  e.preventDefault();
  // alert('cilcou em minimizar');
  mainWindow.minimize();
});

const maximizar = document.getElementById("maximizar");
maximizar.addEventListener('click', function(e) {
  e.preventDefault();
  // alert('cilcou em maximizar');
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    maximizar.textContent = 'maximizar';
    return;
  } 
  mainWindow.maximize();
  maximizar.textContent = 'restaurar';
});

const fechar = document.getElementById("fechar");
fechar.addEventListener('click', function(e) {
  e.preventDefault();
  // alert('cilcou em fechar');
  mainWindow.close();
});

const fullscreen = document.getElementById("fullscreen");
fullscreen.addEventListener('click', function(e) {
  e.preventDefault();
  // alert('cilcou em fullscreen');
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
});

const getgif = document.getElementById("getgif");
getgif.addEventListener('click', function(e) {
  e.preventDefault();
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.status == 200) {
      let response = JSON.parse(httpRequest.response);
      let imgUrl = response.data.images.original.url;
      console.log(response.data.images.original.url)
      document.getElementById('showgif').innerHTML = `<img src="${imgUrl}">`;
    }
  }
  httpRequest.open('GET', 'http://api.giphy.com/v1/gifs/random?api_key=V66gPAYW6Y65OMKdHLb2pID3hzSNW1JH');
  httpRequest.send();
});

let notification = documen.getElementById('notification');
notification.addEventListener('click', function(e) {
  e.preventDefault();

  let notification = new Notification('Minha notificação', {
      body: 'Essa é minha notificação',
      icon: path.join(__dirname, 'tray.png')
    });

    notification.onclick = function() {
      alert('clicado com sucesso');
    }
});

Mousetrap.bind('up up down', function() {
  alert('Show de bola')
})

alert('bem vindo')