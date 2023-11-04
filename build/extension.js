"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));

// src/trees/WorkbenchTreeDataProvider.ts
var import_vscode7 = require("vscode");

// src/trees/items/WorkbenchTreeItem.ts
var import_vscode = require("vscode");
var WorkbenchTreeItem = class extends import_vscode.TreeItem {
  constructor(workbench) {
    super(workbench.name, import_vscode.TreeItemCollapsibleState.Expanded);
    this.workbench = workbench;
    this.tooltip = `${workbench.name} workbench`;
    this.description = workbench.storage.base;
    this.contextValue = "workbench";
  }
};

// src/trees/items/WorkbenchRequestTreeItem.ts
var import_vscode2 = require("vscode");
var import_path = __toESM(require("path"));
var import_fs = require("fs");
var WorkbenchRequestTreeItem = class extends import_vscode2.TreeItem {
  constructor(workbench, request, collection) {
    super(request.name, import_vscode2.TreeItemCollapsibleState.None);
    this.workbench = workbench;
    this.request = request;
    this.collection = collection;
    this.tooltip = `${request.name} request`;
    this.iconPath = this.getIconPath();
    this.command = {
      title: "Open request",
      command: "integrationWorkbench.openRequest",
      arguments: [workbench, request, collection]
    };
  }
  getIconPath() {
    if (this.request.type === "HTTP") {
      const iconPath = import_path.default.join(__filename, "..", "..", "..", "..", "resources", "icons", "methods", `${this.request.details.method}.png`);
      if ((0, import_fs.existsSync)(iconPath)) {
        return {
          light: iconPath,
          dark: iconPath
        };
      }
    }
    return new import_vscode2.ThemeIcon("search-show-context");
  }
};

// src/trees/items/WorkbenchCollectionTreeItem.ts
var import_vscode3 = require("vscode");
var WorkbenchCollectionTreeItem = class extends import_vscode3.TreeItem {
  constructor(workbench, collection) {
    super(collection.name, import_vscode3.TreeItemCollapsibleState.Expanded);
    this.workbench = workbench;
    this.collection = collection;
    this.tooltip = `${collection.name} collection`;
    this.contextValue = "collection";
  }
  iconPath = new import_vscode3.ThemeIcon("folder");
};

// src/Workbenches.ts
var import_vscode6 = require("vscode");

// src/interfaces/workbenches/Workbench.ts
var import_fs2 = require("fs");
var import_vscode4 = require("vscode");
var import_path2 = __toESM(require("path"));
var Workbench = class {
  constructor(input, path8) {
    this.path = path8;
    this.name = input.name;
    this.storage = input.storage;
    this.collections = input.collections;
  }
  name;
  storage;
  collections;
  getMetadataPath() {
    return import_path2.default.join(this.path, "workbench.json");
  }
  save() {
    try {
      if (!(0, import_fs2.existsSync)(this.path)) {
        (0, import_fs2.mkdirSync)(this.path, {
          recursive: true
        });
      }
    } catch (error) {
      import_vscode4.window.showErrorMessage("VS Code may not have permissions to create files in the current workspace folder:\n\n" + error);
    }
    try {
      (0, import_fs2.writeFileSync)(this.getMetadataPath(), JSON.stringify({
        name: this.name,
        storage: this.storage,
        collections: this.collections.map((collection) => {
          return {
            name: collection.name,
            requests: collection.requests.map((request) => {
              const clonedRequest = { ...request };
              delete clonedRequest.webviewPanel;
              return clonedRequest;
            })
          };
        })
      }, void 0, 2));
    } catch (error) {
      import_vscode4.window.showErrorMessage(`Failed to save workbench '${this.name}':

` + error);
    }
  }
};

// src/Workbenches.ts
var import_fs3 = require("fs");
var import_path3 = __toESM(require("path"));

// src/utils/GetRootPath.ts
var import_vscode5 = require("vscode");
function getRootPath() {
  if (import_vscode5.workspace.workspaceFolders?.length) {
    return import_vscode5.workspace.workspaceFolders[0].uri.fsPath;
  }
  return void 0;
}

// src/Workbenches.ts
var workbenches = [];
function scanForWorkbenches(context, refresh = true) {
  const folders = [];
  const rootPaths = [
    context.globalStorageUri.fsPath,
    getRootPath()
  ];
  for (let rootPath of rootPaths) {
    if (!rootPath) {
      continue;
    }
    if (!(0, import_fs3.existsSync)(import_path3.default.join(rootPath, ".workbench"))) {
      continue;
    }
    const files = (0, import_fs3.readdirSync)(import_path3.default.join(rootPath, ".workbench"));
    for (let file of files) {
      if ((0, import_fs3.existsSync)(import_path3.default.join(rootPath, ".workbench", file, "workbench.json"))) {
        folders.push(import_path3.default.join(rootPath, ".workbench", file));
      }
    }
  }
  workbenches.length = 0;
  workbenches.push(...folders.map((folder) => {
    const content = (0, import_fs3.readFileSync)(import_path3.default.join(folder, "workbench.json"), {
      encoding: "utf-8"
    });
    const input = JSON.parse(content);
    return new Workbench(input, folder);
  }));
  if (refresh) {
    import_vscode6.commands.executeCommand(`integrationWorkbench.refresh`);
  }
  return workbenches;
}

// src/trees/WorkbenchTreeDataProvider.ts
var WorkbenchTreeDataProvider = class {
  constructor(context) {
    this.context = context;
  }
  getTreeItem(element) {
    return element;
  }
  getChildren(element) {
    if (!element) {
      return Promise.resolve(
        scanForWorkbenches(this.context, false).map(
          (workbench) => new WorkbenchTreeItem(workbench)
        )
      );
    } else {
      if (element instanceof WorkbenchCollectionTreeItem) {
        return Promise.resolve(
          element.collection.requests.map((request) => new WorkbenchRequestTreeItem(element.workbench, request, element.collection))
        );
      } else if (element instanceof WorkbenchTreeItem) {
        return Promise.resolve(
          element.workbench.collections.map((collection) => new WorkbenchCollectionTreeItem(element.workbench, collection))
        );
      }
    }
    return Promise.resolve([]);
  }
  _onDidChangeTreeData = new import_vscode7.EventEmitter();
  onDidChangeTreeData = this._onDidChangeTreeData.event;
  refresh() {
    this._onDidChangeTreeData.fire();
  }
};

// src/utils/GetWorkbenchStorageOption.ts
var import_vscode8 = require("vscode");
var import_fs4 = require("fs");
var import_path4 = __toESM(require("path"));
async function getWorkbenchStorageOption(context, name) {
  let workbenchStorage = import_vscode8.workspace.getConfiguration("integrationWorkbench").get("defaultWorkbenchStorage");
  let workbenchStoragePath;
  if (!workbenchStorage || workbenchStorage === "prompt") {
    const options = [
      "Repository workbench (stored in the repository filesystem)",
      "User workbench (stored in the VS Code user storage)"
    ];
    const result = await import_vscode8.window.showQuickPick(options, {
      canPickMany: false,
      placeHolder: "Select where the workbench files should be saved:"
    });
    if (!result) {
      return null;
    }
    switch (result) {
      case "Repository workbench (stored in the repository filesystem)": {
        workbenchStorage = "repository";
        break;
      }
      case "User workbench (stored in the VS Code user storage)": {
        workbenchStorage = "user";
        break;
      }
      default:
        throw new Error("Unexpected result from workbench storage option was given: " + result);
    }
  }
  if (workbenchStorage === "repository") {
    const rootPath = getRootPath();
    if (!rootPath) {
      const result = await import_vscode8.window.showSaveDialog({
        defaultUri: import_vscode8.Uri.file(`/.workbench/${name.toLocaleLowerCase()}/`),
        saveLabel: "Select"
      });
      if (!result) {
        return null;
      }
      workbenchStoragePath = result;
    } else {
      workbenchStoragePath = import_vscode8.Uri.file(rootPath);
    }
  } else if (workbenchStorage === "user") {
    workbenchStoragePath = context.globalStorageUri;
  } else {
    throw new Error("Invalid workbench storage option was given: " + workbenchStorage);
  }
  const workbenchesPath = import_path4.default.join(workbenchStoragePath.fsPath, ".workbench/");
  try {
    if (!(0, import_fs4.existsSync)(workbenchesPath)) {
      (0, import_fs4.mkdirSync)(workbenchesPath, {
        recursive: true
      });
    }
  } catch (error) {
    import_vscode8.window.showErrorMessage("VS Code may not have permissions to create files in the current workspace folder:\n\n" + error);
    return null;
  }
  return {
    location: workbenchStorage,
    path: workbenchesPath
  };
}

// src/utils/GetUniqueFolderPath.ts
var import_fs5 = require("fs");
var import_path5 = __toESM(require("path"));
function getUniqueFolderPath(rootPath, folderName) {
  let currentPath = import_path5.default.join(rootPath, folderName);
  if (!(0, import_fs5.existsSync)(currentPath)) {
    return currentPath;
  }
  for (let index = 1; index < 20; index++) {
    currentPath = import_path5.default.join(rootPath, folderName + "-" + index);
    if (!(0, import_fs5.existsSync)(currentPath)) {
      return currentPath;
    }
  }
  return null;
}

// src/utils/GetCamelizedString.ts
function getCamelizedString(string) {
  return string.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
    if (index === 0) {
      return word.toLowerCase();
    }
    return word.toUpperCase();
  }).replace(/\s+/g, "");
}

// src/extension.ts
var import_crypto = require("crypto");
var import_path7 = __toESM(require("path"));

// src/panels/RequestWebviewPanel.ts
var import_vscode10 = require("vscode");

// src/utils/GetWebviewUri.ts
var import_vscode9 = require("vscode");
function getWebviewUri(webview, extensionUri, pathList) {
  return webview.asWebviewUri(import_vscode9.Uri.joinPath(extensionUri, ...pathList));
}

// src/utils/GetWebviewNonce.ts
function getWebviewNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// src/panels/RequestWebviewPanel.ts
var import_fs6 = require("fs");
var import_path6 = __toESM(require("path"));
var RequestWebviewPanel = class {
  constructor(context, workbench, request, collection) {
    this.context = context;
    this.workbench = workbench;
    this.request = request;
    this.collection = collection;
    this.webviewPanel = import_vscode10.window.createWebviewPanel(
      `request-${request.id}`,
      request.name,
      import_vscode10.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [import_vscode10.Uri.joinPath(context.extensionUri, "build")]
      }
    );
    this.webviewPanel.onDidDispose(() => this.dispose(), null, this.disposables);
    const webviewUri = getWebviewUri(this.webviewPanel.webview, context.extensionUri, ["build", "webview.js"]);
    const nonce = getWebviewNonce();
    this.webviewPanel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">

          <meta name="viewport" content="width=device-width,initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}';">

          <title>Hello World!</title>
        </head>
        <body>
          ${(0, import_fs6.readFileSync)(
      import_path6.default.join(__filename, "..", "..", "resources", "request", "index.html"),
      {
        encoding: "utf-8"
      }
    )}

          <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
        </body>
      </html>
    `;
    this.webviewPanel.webview.onDidReceiveMessage(
      (message) => {
        const command = message.command;
        const text = message.text;
        switch (command) {
          case "hello":
            import_vscode10.window.showInformationMessage(text);
            return;
        }
      },
      void 0,
      this.disposables
    );
  }
  webviewPanel;
  disposables = [];
  reveal() {
    const columnToShowIn = import_vscode10.window.activeTextEditor ? import_vscode10.window.activeTextEditor.viewColumn : void 0;
    this.webviewPanel.reveal(columnToShowIn);
  }
  dispose() {
    this.webviewPanel.dispose();
    while (this.disposables.length) {
      const disposable = this.disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
};

// src/extension.ts
function activate(context) {
  console.log('Congratulations, your extension "integrationworkbench" is now active!');
  const workbenchesTreeDataProvider = new WorkbenchTreeDataProvider(context);
  const workbenchTreeView = vscode.window.createTreeView("workbenches", {
    treeDataProvider: workbenchesTreeDataProvider
  });
  context.subscriptions.push(vscode.commands.registerCommand("integrationWorkbench.createWorkbench", async () => {
    vscode.window.showInformationMessage("Create workbench");
    const name = await vscode.window.showInputBox({
      placeHolder: "Enter the name of this workbench:",
      validateInput(value) {
        if (!value.length) {
          return "You must enter a name for this workbench!";
        }
        return null;
      }
    });
    if (!name) {
      return;
    }
    const storageOption = await getWorkbenchStorageOption(context, name);
    if (!storageOption) {
      return;
    }
    const uniqueWorkbenchPath = getUniqueFolderPath(storageOption.path, getCamelizedString(name));
    if (!uniqueWorkbenchPath) {
      vscode.window.showErrorMessage("There is too many workbenches with the same name in this storage option, please choose a different name.");
      return null;
    }
    const rootPath = getRootPath();
    const workbench = new Workbench({
      name,
      storage: {
        location: storageOption.location,
        base: rootPath ? import_path7.default.basename(rootPath) : void 0
      },
      collections: []
    }, uniqueWorkbenchPath);
    workbench.save();
    workbenches.push(workbench);
    workbenchesTreeDataProvider.refresh();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("integrationWorkbench.createCollection", (reference) => {
    vscode.window.showInformationMessage("Create collection");
    vscode.window.showInputBox({
      prompt: "Enter a collection name",
      validateInput(value) {
        if (!value.length) {
          return "You must enter a collection name or cancel.";
        }
        return null;
      }
    }).then((value) => {
      if (!value) {
        return;
      }
      if (reference instanceof WorkbenchTreeItem) {
        reference.workbench.collections.push({
          name: value,
          requests: []
        });
        reference.workbench.save();
        workbenchesTreeDataProvider.refresh();
      }
    });
  }));
  context.subscriptions.push(vscode.commands.registerCommand("integrationWorkbench.createRequest", (reference) => {
    vscode.window.showInformationMessage("Create request");
    vscode.window.showInputBox({
      prompt: "Enter the request name",
      validateInput(value) {
        if (!value.length) {
          return "You must enter a name or cancel.";
        }
        return null;
      }
    }).then((value) => {
      if (!value) {
        return;
      }
      if (reference instanceof WorkbenchCollectionTreeItem) {
        reference.collection.requests.push({
          id: (0, import_crypto.randomUUID)(),
          name: value,
          type: null
        });
        reference.workbench.save();
        workbenchesTreeDataProvider.refresh();
      }
    });
  }));
  context.subscriptions.push(vscode.commands.registerCommand("integrationWorkbench.openRequest", (workbench, request, collection) => {
    if (!request.webviewPanel) {
      request.webviewPanel = new RequestWebviewPanel(context, workbench, request, collection);
    } else {
      request.webviewPanel.reveal();
    }
  }));
  context.subscriptions.push(vscode.commands.registerCommand("integrationWorkbench.refresh", () => {
    workbenchesTreeDataProvider.refresh();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("integrationWorkbench.openWalkthrough", () => {
    vscode.commands.executeCommand(`workbench.action.openWalkthrough`, `nora-soderlund.integrationWorkbench#workbenches.openWorkbenches`, false);
  }));
  scanForWorkbenches(context);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
