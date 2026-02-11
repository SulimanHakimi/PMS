const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') }); // Load env vars
const dbHandlers = require('./db-handlers');

const isDev = process.env.NODE_ENV !== 'production';

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: 'Pharma One PMS',
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // For easier dev, modify for security in prod
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.setMenuBarVisibility(false);

    const startUrl = isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../out/index.html')}`;

    mainWindow.loadURL(startUrl);

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();
    // Connect to MongoDB
    if (process.env.MONGODB_URI) {
        dbHandlers.connectDB(process.env.MONGODB_URI);
    } else {
        console.warn('MONGODB_URI not found in environment variables');
    }
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

// IPC listeners for Online/Offline status or Database sync can go here
ipcMain.on('app-status', (event, arg) => {
    console.log(arg); // prints "ping"
    event.reply('app-status-reply', 'pong');
});

// Database IPC Handlers
Object.entries(dbHandlers.handlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, handler);
});
