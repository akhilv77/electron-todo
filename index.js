const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(`file://${__dirname}./main.html`);
  mainWindow.on("closed", () => {
    app.quit();
  });

  ipcMain.on("addTodo", (event, todo) => {
    mainWindow.webContents.send("addTodo", todo);
    addWindow.close();
  });

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

const addTodo = () => {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add new todo!",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  addWindow.loadURL(`file://${__dirname}./addTodo.html`);
  //below line is used because when addWindow.close() the addWindow is closed but garbage is present to remove that we need null the declaration
  addWindow.on("closed", () => (addWindow = null));
};

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New Todo",
        accelerator: "Ctrl+N",
        click() {
          addTodo();
        },
      },
      {
        label: "Delete todos",
        accelerator: "Ctrl+D",
        click() {
          mainWindow.webContents.send("deleteTodos");
        },
      },
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

// this is because in mac os first menu is set by default to disable that we use this
if (process.platform === "darwin") {
  menuTemplate.unShift({});
}

// this is used when we want dev tools only in development mode
//focusedWindow is the predefined module used to define current focused addWindow
//toggleDevTools() is used to get the dev tools..
//role is predefined menu there almost all default menus but we created toggleDevTools for our understanding refer docs

if (process.env.NODE_ENV !== "production") {
  menuTemplate.push({
    label: "View",
    submenu: [
      {
        role: "reload",
      },
      {
        label: "Toggle Dev Tools",
        accelerator:
          process.platform === "darwin" ? "Shift+Command+I" : "Shift+Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
    ],
  });
}
