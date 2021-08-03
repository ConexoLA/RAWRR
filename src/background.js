/* eslint-disable no-console */
"use strict";

import { app, protocol, BrowserWindow } from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import createProtocol from "vue-cli-plugin-electron-builder/lib/createProtocol";
const isDevelopment = process.env.NODE_ENV !== "production";

import * as transponder from "./transponder";
import * as init from "./db/00_initdb";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1300,
    height: 680,
    minWidth: 1300,
    minHeight: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Disables new window (alt + enter)
  win.webContents.on("new-window", function (event, url) {
    event.preventDefault();
  });

  //Hides the menu bar on the window
  win.setMenuBarVisibility(false);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    init.close();
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  try {
    transponder.setIPCMainListeners();
  } catch (error) {
    console.log(error);
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        init.close();
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      init.close();
      app.quit();
    });
  }
}
