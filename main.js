const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process'); // Import exec to run shell commands

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
  if (process.platform !== 'darwin') {
    console.log('Closing app and stopping backend server...');
    // Run the kill-port command to stop the backend server
    exec('npx kill-port 5000 3000', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error killing ports: ${error.message}`);
      } else if (stderr) {
        console.error(`stderr: ${stderr}`);
      } else {
        console.log(`stdout: ${stdout}`);
      }
      // Quit the app after killing the ports
      app.quit();
    });
  }
});