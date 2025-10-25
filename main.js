const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('dotenv').config();
const fetch = require('node-fetch');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
  if (process.env.NODE_ENV === 'development') win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

ipcMain.handle('openai-chat', async (event, {messages, model, max_tokens}) => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set in environment');
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages,
      max_tokens: max_tokens || 1000
    })
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`OpenAI error: ${resp.status} ${txt}`);
  }
  return await resp.json();
});

ipcMain.on('openai-chat-stream', async (event, {messages, model, max_tokens}) => {
  const sender = event.sender;
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    sender.send('openai-stream-error', 'OPENAI_API_KEY not set in environment');
    return;
  }

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages,
        max_tokens: max_tokens || 1000,
        stream: true
      })
    });

    if (!resp.ok) {
      const txt = await resp.text();
      sender.send('openai-stream-error', `OpenAI error: ${resp.status} ${txt}`);
      return;
    }

    for await (const chunk of resp.body) {
      const text = chunk.toString('utf8');
      sender.send('openai-stream-chunk', text);
    }
    sender.send('openai-stream-done');
  } catch (err) {
    sender.send('openai-stream-error', err.message || String(err));
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
