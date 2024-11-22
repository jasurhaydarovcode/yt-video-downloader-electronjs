const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ytDlp = require('yt-dlp-exec'); // To'g'ri import
const { dialog } = require('electron');

// Elektron oynasini yaratish
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Video yuklab olish uchun IPC listener
ipcMain.handle('download-video', async (event, { url, format }) => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Saqlash joyini tanlang',
    defaultPath: 'video.mp4'
  });

  if (filePath) {
    try {
      // `ytDlp` ni chaqirish
      await ytDlp(url, {
        output: filePath,
        format: format
      });
      return 'Yuklab olish muvaffaqiyatli tugadi!';
    } catch (error) {
      return `Xato: ${error.message}`;
    }
  } else {
    return 'Fayl tanlanmadi.';
  }
});
