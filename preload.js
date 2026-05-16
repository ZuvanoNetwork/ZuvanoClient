const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('zuvano', {
  version: '1.0.0'
});