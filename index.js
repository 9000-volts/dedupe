/* jshint esnext: true, node: true */
'use strict';

const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
var dialog = require('dialog');
const ipc = electron.ipcMain;
var walk = require ("walk");
var scanner = require ("./scanner");
var deduplicator = require("./deduplicator") ;

// Keep a global reference of the window object.
var mainWindow = null;
var infoWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

ipc.on("open", function () {
  var path = dialog.showOpenDialog(mainWindow, {
    title: "Choose an image folder to dedupe images from.",
    properties: ["openDirectory", "multiSelections"]
  });
  if (path && path.length > 0) {
    // Tell the renderer the images are being processed.
    mainWindow.webContents.executeJavaScript("processing();");
    var scanFolder = function (n, arr) {
      console.log ("SCANNING FOLDER " + path[n]);
      scanner.scan(path[n], function (results) {
        console.log("DONE");
        arr = arr.concat (results);
        if (++n < path.length) {
          scanFolder (n, arr);
        } else {
          console.log("DEDUPLICATING");
          deduplicator.deduplicate (arr, function () {
            mainWindow.webContents.executeJavaScript("done();");
          });
        }
      });
    };
    scanFolder(0, []);
  }
});

ipc.on("information", function () {
  if (!infoWindow) {
    infoWindow = new BrowserWindow({width: 700, height: 650, resizable: false});
    infoWindow.setMenu (null);
    infoWindow.loadURL('file://' + __dirname + '/info.html');
    infoWindow.on('closed', function() {
      infoWindow = null;
      mainWindow.focus();
    });
  } else {
    infoWindow.focus();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 500, height: 500, resizable: false});
  mainWindow.setMenu (null);
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
