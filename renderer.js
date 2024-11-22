const { ipcRenderer } = require('electron');

document.getElementById('downloadBtn').addEventListener('click', async () => {
  const url = document.getElementById('url').value;
  const format = document.getElementById('format').value;

  if (!url) {
    alert('Iltimos, URL kiriting.');
    return;
  }

  const statusElement = document.getElementById('status');
  statusElement.textContent = 'Yuklab olinmoqda...';

  try {
    const message = await ipcRenderer.invoke('download-video', { url, format });
    statusElement.textContent = message;
  } catch (error) {
    statusElement.textContent = `Xato: ${error.message}`;
  }
});
