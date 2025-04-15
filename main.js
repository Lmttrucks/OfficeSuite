const { app, BrowserWindow } = require('electron');
const path = require('path');

const mode = process.env.MODE || 'dev'; // Default to 'dev' mode

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      zoomFactor: 0.75, // Set the zoom level to 75%
    },
  });
  mainWindow.maximize();

  if (mode === 'pro') {
    const indexPath = path.join(__dirname, 'build', 'index.html');
    mainWindow.loadFile(indexPath).catch((err) => {
      console.error('Failed to load index.html:', err);
    });
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});