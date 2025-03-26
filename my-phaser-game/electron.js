const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Allow Node.js integration (if needed for Electron APIs)
    },
  });

  // Load either the Vite server in development or the built app in production
  if (isDev) {
    // During development, load from Vite server
    win.loadURL('http://localhost:5173');
  } else {
    // During production, load the build files directly
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  win.webContents.openDevTools(); // Optionally open DevTools in development
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
