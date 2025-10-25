const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('shawa', {
  chat: async (payload) => {
    return await ipcRenderer.invoke('openai-chat', payload);
  },
  stream: (payload) => {
    ipcRenderer.send('openai-chat-stream', payload);
  },
  onStreamChunk: (cb) => {
    ipcRenderer.on('openai-stream-chunk', (e, chunk) => cb(chunk));
  },
  onStreamDone: (cb) => {
    ipcRenderer.on('openai-stream-done', () => cb());
  },
  onStreamError: (cb) => {
    ipcRenderer.on('openai-stream-error', (e, err) => cb(err));
  }
});
