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

// src/workbenches/trees/workbenches/WorkbenchTreeDataProvider.ts
var import_vscode12 = require("vscode");

// src/workbenches/trees/workbenches/items/WorkbenchTreeItem.ts
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

// src/workbenches/trees/workbenches/items/WorkbenchRequestTreeItem.ts
var import_vscode7 = require("vscode");
var import_path2 = __toESM(require("path"));
var import_fs2 = require("fs");

// src/workbenches/requests/WorkbenchHttpRequest.ts
var import_vscode6 = require("vscode");

// src/workbenches/requests/WorkbenchRequest.ts
var import_vscode5 = require("vscode");

// src/interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations.ts
function isHttpRequestData(requestData) {
  return requestData.type === "HTTP";
}

// src/panels/RequestWebviewPanel.ts
var import_vscode4 = require("vscode");

// src/utils/GetWebviewUri.ts
var import_vscode2 = require("vscode");
function getWebviewUri(webview, extensionUri, pathList) {
  return webview.asWebviewUri(import_vscode2.Uri.joinPath(extensionUri, ...pathList));
}

// src/panels/RequestWebviewPanel.ts
var import_fs = require("fs");
var import_path = __toESM(require("path"));

// src/workbenches/responses/WorkbenchHttpResponse.ts
var import_vscode3 = require("vscode");
var WorkbenchHttpResponse = class {
  constructor(id, request, requestedAt) {
    this.id = id;
    this.request = request;
    this.requestedAt = requestedAt;
    if (!request.data.url) {
      import_vscode3.window.showErrorMessage("No URL was provided in the request.");
      return;
    }
    fetch(request.data.url, {
      method: request.data.method
    }).then(this.handleResponse.bind(this));
  }
  response;
  result;
  getData() {
    return {
      id: this.id,
      request: this.request,
      requestedAt: this.requestedAt.toISOString(),
      result: this.result && {
        body: this.result.body,
        headers: this.result.headers
      }
    };
  }
  async handleResponse(response) {
    this.response = response;
    const headers = {};
    const body = await response.text();
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    this.result = {
      body,
      headers
    };
    import_vscode3.commands.executeCommand("integrationWorkbench.refreshResponses");
  }
};

// src/panels/RequestWebviewPanel.ts
var import_crypto = require("crypto");
var RequestWebviewPanel = class {
  constructor(context, request) {
    this.context = context;
    this.request = request;
    this.webviewPanel = import_vscode4.window.createWebviewPanel(
      "integrationWorkbench.request",
      request.name,
      import_vscode4.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          import_vscode4.Uri.joinPath(context.extensionUri, "build"),
          import_vscode4.Uri.joinPath(context.extensionUri, "resources")
        ]
      }
    );
    this.webviewPanel.onDidDispose(() => this.dispose(), null, this.disposables);
    const webviewUri = getWebviewUri(this.webviewPanel.webview, context.extensionUri, ["build", "webviews", "request.js"]);
    const styleUri = getWebviewUri(this.webviewPanel.webview, context.extensionUri, ["resources", "request", "styles", "request.css"]);
    const shikiUri = getWebviewUri(this.webviewPanel.webview, context.extensionUri, ["resources", "shiki"]);
    this.webviewPanel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8"/>

          <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
          
          <title>Hello World!</title>

          <link rel="stylesheet" href="${styleUri}"/>
        </head>
        <body>
          ${(0, import_fs.readFileSync)(
      import_path.default.join(__filename, "..", "..", "resources", "request", "request.html"),
      {
        encoding: "utf-8"
      }
    )}

          <script type="text/javascript">
            window.shikiUri = "${shikiUri}";
          </script>

          <script type="module" src="${webviewUri}"></script>
        </body>
      </html>
    `;
    this.webviewPanel.webview.onDidReceiveMessage(
      (message) => {
        const command = message.command;
        console.debug("Received event from request webview:", command);
        switch (command) {
          case "integrationWorkbench.changeHttpRequestMethod": {
            const [method] = message.arguments;
            if (this.request instanceof WorkbenchHttpRequest) {
              this.request.setMethod(method);
            }
            return;
          }
          case "integrationWorkbench.changeHttpRequestUrl": {
            const [url] = message.arguments;
            if (this.request instanceof WorkbenchHttpRequest) {
              this.request.setUrl(url);
            }
            return;
          }
          case "integrationWorkbench.sendHttpRequest": {
            import_vscode4.commands.executeCommand("integrationWorkbench.addResponse", new WorkbenchHttpResponse(
              (0, import_crypto.randomUUID)(),
              this.request.getData(),
              new Date()
            ));
            return;
          }
          case "integrationWorkbench.getRequest": {
            this.webviewPanel.webview.postMessage({
              command: "integrationWorkbench.updateRequest",
              arguments: [this.request.getData()]
            });
            return;
          }
        }
      },
      void 0,
      this.disposables
    );
  }
  webviewPanel;
  disposables = [];
  reveal() {
    const columnToShowIn = import_vscode4.window.activeTextEditor ? import_vscode4.window.activeTextEditor.viewColumn : void 0;
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
    this.request.disposeWebviewPanel();
  }
};

// src/workbenches/requests/WorkbenchRequest.ts
var WorkbenchRequest = class {
  constructor(parent, id, name) {
    this.parent = parent;
    this.id = id;
    this.name = name;
  }
  id;
  name;
  requestWebviewPanel;
  treeDataViewItems = [];
  getData() {
    return {
      id: this.id,
      name: this.name,
      type: "HTTP",
      data: {
        method: ""
      }
    };
  }
  static fromData(parent, data) {
    if (isHttpRequestData(data)) {
      return WorkbenchHttpRequest.fromData(parent, data);
    }
    throw new Error("Tried to parse invalid request type.");
  }
  send() {
    throw new Error("Not implemented.");
  }
  showWebviewPanel(context) {
    if (!this.requestWebviewPanel) {
      this.requestWebviewPanel = new RequestWebviewPanel(context, this);
    } else {
      this.requestWebviewPanel.reveal();
    }
    import_vscode5.commands.executeCommand("integrationWorkbench.openResponse", this);
  }
  disposeWebviewPanel() {
    delete this.requestWebviewPanel;
  }
};

// src/workbenches/requests/WorkbenchHttpRequest.ts
var WorkbenchHttpRequest = class extends WorkbenchRequest {
  constructor(parent, id, name, data) {
    super(parent, id, name);
    this.data = data;
  }
  getData() {
    return {
      id: this.id,
      name: this.name,
      type: "HTTP",
      data: {
        method: this.data.method,
        url: this.data.url
      }
    };
  }
  static fromData(parent, data) {
    return new WorkbenchHttpRequest(parent, data.id, data.name, data.data);
  }
  send() {
  }
  setMethod(method) {
    this.data.method = method;
    this.treeDataViewItems.forEach((treeDataViewItem) => treeDataViewItem.setIconPath());
    import_vscode6.commands.executeCommand("integrationWorkbench.refreshWorkbenches");
    this.parent.save();
  }
  setUrl(url) {
    this.data.url = url;
    this.parent.save();
  }
};

// src/workbenches/trees/workbenches/items/WorkbenchRequestTreeItem.ts
var WorkbenchRequestTreeItem = class extends import_vscode7.TreeItem {
  constructor(workbench, request, collection) {
    super(request.name, import_vscode7.TreeItemCollapsibleState.None);
    this.workbench = workbench;
    this.request = request;
    this.collection = collection;
    this.tooltip = `${request.name} request`;
    this.command = {
      title: "Open request",
      command: "integrationWorkbench.openRequest",
      arguments: [workbench, request, collection]
    };
    this.setIconPath();
  }
  getIconPath() {
    if (this.request instanceof WorkbenchHttpRequest) {
      if (this.request.data.method) {
        const iconPath = import_path2.default.join(__filename, "..", "..", "resources", "icons", "methods", `${this.request.data.method}.png`);
        if ((0, import_fs2.existsSync)(iconPath)) {
          return {
            light: iconPath,
            dark: iconPath
          };
        }
      }
    }
    return new import_vscode7.ThemeIcon("search-show-context");
  }
  setIconPath() {
    this.iconPath = this.getIconPath();
  }
};

// src/workbenches/trees/workbenches/items/WorkbenchCollectionTreeItem.ts
var import_vscode8 = require("vscode");
var WorkbenchCollectionTreeItem = class extends import_vscode8.TreeItem {
  constructor(workbench, collection) {
    super(collection.name, import_vscode8.TreeItemCollapsibleState.Expanded);
    this.workbench = workbench;
    this.collection = collection;
    this.tooltip = `${collection.name} collection`;
    this.contextValue = "collection";
  }
  iconPath = new import_vscode8.ThemeIcon("folder");
};

// src/Workbenches.ts
var import_vscode11 = require("vscode");

// src/workbenches/Workbench.ts
var import_fs3 = require("fs");
var import_vscode9 = require("vscode");
var import_path3 = __toESM(require("path"));

// src/workbenches/collections/WorkbenchCollection.ts
var WorkbenchCollection = class {
  parent;
  id;
  name;
  requests;
  constructor(parent, id, name, requests) {
    this.parent = parent;
    this.id = id;
    this.name = name;
    this.requests = requests.map((request) => WorkbenchRequest.fromData(this, request));
  }
  getData() {
    return {
      id: this.id,
      name: this.name,
      requests: this.requests.map((request) => request.getData())
    };
  }
  save() {
    this.parent.save();
  }
};

// src/workbenches/Workbench.ts
var Workbench = class {
  constructor(data, path10) {
    this.path = path10;
    this.id = data.id;
    this.name = data.name;
    this.storage = data.storage;
    this.collections = data.collections.map((collection) => new WorkbenchCollection(this, collection.id, collection.name, collection.requests));
  }
  id;
  name;
  storage;
  collections;
  getMetadataPath() {
    return import_path3.default.join(this.path, "workbench.json");
  }
  getData() {
    return {
      id: this.id,
      name: this.name,
      storage: this.storage,
      collections: this.collections.map((collection) => collection.getData())
    };
  }
  save() {
    try {
      if (!(0, import_fs3.existsSync)(this.path)) {
        (0, import_fs3.mkdirSync)(this.path, {
          recursive: true
        });
      }
    } catch (error) {
      import_vscode9.window.showErrorMessage("VS Code may not have permissions to create files in the current workspace folder:\n\n" + error);
    }
    try {
      (0, import_fs3.writeFileSync)(this.getMetadataPath(), JSON.stringify(this.getData(), void 0, 2));
    } catch (error) {
      import_vscode9.window.showErrorMessage(`Failed to save workbench '${this.name}':

` + error);
    }
  }
};

// src/Workbenches.ts
var import_fs4 = require("fs");
var import_path4 = __toESM(require("path"));

// src/utils/GetRootPath.ts
var import_vscode10 = require("vscode");
function getRootPath() {
  if (import_vscode10.workspace.workspaceFolders?.length) {
    return import_vscode10.workspace.workspaceFolders[0].uri.fsPath;
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
    if (!(0, import_fs4.existsSync)(import_path4.default.join(rootPath, ".workbench"))) {
      continue;
    }
    const files = (0, import_fs4.readdirSync)(import_path4.default.join(rootPath, ".workbench"));
    for (let file of files) {
      if ((0, import_fs4.existsSync)(import_path4.default.join(rootPath, ".workbench", file, "workbench.json"))) {
        folders.push(import_path4.default.join(rootPath, ".workbench", file));
      }
    }
  }
  workbenches.length = 0;
  workbenches.push(...folders.map((folder) => {
    const content = (0, import_fs4.readFileSync)(import_path4.default.join(folder, "workbench.json"), {
      encoding: "utf-8"
    });
    const input = JSON.parse(content);
    return new Workbench(input, folder);
  }));
  if (refresh) {
    import_vscode11.commands.executeCommand(`integrationWorkbench.refreshWorkbenches`);
  }
  return workbenches;
}

// src/workbenches/trees/workbenches/WorkbenchTreeDataProvider.ts
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
          element.collection.requests.map((request) => {
            const requestTreeItem = new WorkbenchRequestTreeItem(element.workbench, request, element.collection);
            request.treeDataViewItems.push(requestTreeItem);
            return requestTreeItem;
          })
        );
      } else if (element instanceof WorkbenchTreeItem) {
        return Promise.resolve(
          element.workbench.collections.map((collection) => new WorkbenchCollectionTreeItem(element.workbench, collection))
        );
      }
    }
    return Promise.resolve([]);
  }
  _onDidChangeTreeData = new import_vscode12.EventEmitter();
  onDidChangeTreeData = this._onDidChangeTreeData.event;
  refresh() {
    this._onDidChangeTreeData.fire();
  }
};

// src/commands/collections/CreateCollectionCommand.ts
var import_vscode13 = require("vscode");
var import_crypto2 = require("crypto");
var CreateCollectionCommand = class {
  constructor(context) {
    this.context = context;
    context.subscriptions.push(
      import_vscode13.commands.registerCommand("integrationWorkbench.createCollection", this.handle.bind(this))
    );
  }
  async handle(reference) {
    import_vscode13.window.showInformationMessage("Create collection");
    import_vscode13.window.showInputBox({
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
        reference.workbench.collections.push(
          new WorkbenchCollection(reference.workbench, (0, import_crypto2.randomUUID)(), value, [])
        );
        reference.workbench.save();
        import_vscode13.commands.executeCommand("integrationWorkbench.refreshWorkbenches");
      }
    });
  }
};

// src/commands/requests/CreateRequestCommand.ts
var import_vscode14 = require("vscode");
var import_crypto3 = require("crypto");
var CreateRequestCommand = class {
  constructor(context) {
    this.context = context;
    context.subscriptions.push(
      import_vscode14.commands.registerCommand("integrationWorkbench.createRequest", this.handle.bind(this))
    );
  }
  async handle(reference) {
    import_vscode14.window.showInformationMessage("Create request");
    import_vscode14.window.showInputBox({
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
        reference.collection.requests.push(
          new WorkbenchHttpRequest(reference.collection, (0, import_crypto3.randomUUID)(), value, {
            method: "GET",
            url: "https://httpbin.org/get"
          })
        );
        reference.workbench.save();
        import_vscode14.commands.executeCommand("integrationWorkbench.refreshWorkbenches");
      }
    });
  }
};

// src/commands/requests/OpenRequestCommand.ts
var import_vscode15 = require("vscode");
var OpenRequestCommand = class {
  constructor(context) {
    this.context = context;
    context.subscriptions.push(
      import_vscode15.commands.registerCommand("integrationWorkbench.openRequest", this.handle.bind(this))
    );
  }
  async handle(workbench, request, collection) {
    request.showWebviewPanel(this.context);
  }
};

// src/commands/workbenches/CreateWorkbenchCommand.ts
var import_vscode17 = require("vscode");

// src/utils/GetWorkbenchStorageOption.ts
var import_vscode16 = require("vscode");
var import_fs5 = require("fs");
var import_path5 = __toESM(require("path"));
async function getWorkbenchStorageOption(context, name) {
  let workbenchStorage = import_vscode16.workspace.getConfiguration("integrationWorkbench").get("defaultWorkbenchStorage");
  let workbenchStoragePath;
  if (!workbenchStorage || workbenchStorage === "prompt") {
    const options = [
      "Repository workbench (stored in the repository filesystem)",
      "User workbench (stored in the VS Code user storage)"
    ];
    const result = await import_vscode16.window.showQuickPick(options, {
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
      const result = await import_vscode16.window.showSaveDialog({
        defaultUri: import_vscode16.Uri.file(`/.workbench/${name.toLocaleLowerCase()}/`),
        saveLabel: "Select"
      });
      if (!result) {
        return null;
      }
      workbenchStoragePath = result;
    } else {
      workbenchStoragePath = import_vscode16.Uri.file(rootPath);
    }
  } else if (workbenchStorage === "user") {
    workbenchStoragePath = context.globalStorageUri;
  } else {
    throw new Error("Invalid workbench storage option was given: " + workbenchStorage);
  }
  const workbenchesPath = import_path5.default.join(workbenchStoragePath.fsPath, ".workbench/");
  try {
    if (!(0, import_fs5.existsSync)(workbenchesPath)) {
      (0, import_fs5.mkdirSync)(workbenchesPath, {
        recursive: true
      });
    }
  } catch (error) {
    import_vscode16.window.showErrorMessage("VS Code may not have permissions to create files in the current workspace folder:\n\n" + error);
    return null;
  }
  return {
    location: workbenchStorage,
    path: workbenchesPath
  };
}

// src/utils/GetUniqueFolderPath.ts
var import_fs6 = require("fs");
var import_path6 = __toESM(require("path"));
function getUniqueFolderPath(rootPath, folderName) {
  let currentPath = import_path6.default.join(rootPath, folderName);
  if (!(0, import_fs6.existsSync)(currentPath)) {
    return currentPath;
  }
  for (let index = 1; index < 20; index++) {
    currentPath = import_path6.default.join(rootPath, folderName + "-" + index);
    if (!(0, import_fs6.existsSync)(currentPath)) {
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

// src/commands/workbenches/CreateWorkbenchCommand.ts
var import_path7 = __toESM(require("path"));
var CreateWorkbenchCommand = class {
  constructor(context) {
    this.context = context;
    context.subscriptions.push(
      import_vscode17.commands.registerCommand("integrationWorkbench.createWorkbench", this.handle.bind(this))
    );
  }
  async handle() {
    import_vscode17.window.showInformationMessage("Create workbench");
    const name = await import_vscode17.window.showInputBox({
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
    const storageOption = await getWorkbenchStorageOption(this.context, name);
    if (!storageOption) {
      return;
    }
    const uniqueWorkbenchPath = getUniqueFolderPath(storageOption.path, getCamelizedString(name));
    if (!uniqueWorkbenchPath) {
      import_vscode17.window.showErrorMessage("There is too many workbenches with the same name in this storage option, please choose a different name.");
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
    import_vscode17.commands.executeCommand("integrationWorkbench.refreshWorkbenches");
  }
};

// src/commands/responses/OpenResponseCommand.ts
var import_vscode18 = require("vscode");
var OpenResponseCommand = class {
  constructor(context) {
    this.context = context;
    context.subscriptions.push(
      import_vscode18.commands.registerCommand("integrationWorkbench.openResponse", this.handle.bind(this))
    );
  }
  async handle(request) {
  }
};

// src/extension.ts
var import_fs8 = require("fs");
var import_path9 = __toESM(require("path"));

// src/workbenches/trees/responses/WorkbenchesRequestsTreeDataProvider.ts
var import_vscode21 = require("vscode");

// src/workbenches/trees/responses/items/WorkbenchResponseTreeItem.ts
var import_vscode19 = require("vscode");
var import_path8 = __toESM(require("path"));
var import_fs7 = require("fs");
var WorkbenchResponseTreeItem = class extends import_vscode19.TreeItem {
  constructor(response) {
    super(response.request.name, import_vscode19.TreeItemCollapsibleState.None);
    this.response = response;
    this.contextValue = response.result ? "response" : "responseLoading";
    this.tooltip = `${response.request.name} response`;
    this.description = `${response.requestedAt.getHours()}:${response.requestedAt.getMinutes().toString().padStart(2, "0")}`;
    this.setIconPath();
    this.updateDescription();
    this.command = {
      title: "Show response",
      command: "integrationWorkbench.showResponse",
      arguments: [response]
    };
  }
  getDescription() {
    const now = Date.now();
    const then = this.response.requestedAt.getTime();
    const difference = now - then;
    if (difference < 60 * 1e3) {
      return "just now";
    }
    if (difference < 60 * 60 * 1e3) {
      return Math.floor(difference / 1e3 / 60) + " minutes ago";
    }
    return Math.floor(difference / 1e3 / 60 / 60) + " hours ago";
  }
  updateDescription() {
    this.description = this.getDescription();
  }
  getIconPath() {
    if (this.response.result) {
      if (isHttpRequestData(this.response.request)) {
        const iconPath = import_path8.default.join(__filename, "..", "..", "resources", "icons", "methods", `${this.response.request.data.method}.png`);
        if ((0, import_fs7.existsSync)(iconPath)) {
          return {
            light: iconPath,
            dark: iconPath
          };
        }
      }
      return new import_vscode19.ThemeIcon("search-show-context");
    }
    return new import_vscode19.ThemeIcon("loading~spin", new import_vscode19.ThemeColor("progressBar.background"));
  }
  setIconPath() {
    this.iconPath = this.getIconPath();
  }
};

// src/workbenches/trees/responses/items/WorkbenchResponsesBookmarkTreeItem.ts
var import_vscode20 = require("vscode");
var WorkbenchResponsesBookmarkTreeItem = class extends import_vscode20.TreeItem {
  constructor() {
    super("Bookmarks", import_vscode20.TreeItemCollapsibleState.None);
    this.tooltip = `Response Bookmarks`;
    this.iconPath = new import_vscode20.ThemeIcon("bookmark");
  }
};

// src/workbenches/trees/responses/WorkbenchesRequestsTreeDataProvider.ts
var WorkbenchesRequestsTreeDataProvider = class {
  constructor(context) {
    this.context = context;
  }
  workbenchResponses = [];
  getTreeItem(element) {
    return element;
  }
  getChildren(element) {
    if (!element) {
      return Promise.resolve(
        [
          new WorkbenchResponsesBookmarkTreeItem(),
          ...this.workbenchResponses.map(
            (response) => new WorkbenchResponseTreeItem(response)
          )
        ]
      );
    }
    return Promise.resolve([]);
  }
  _onDidChangeTreeData = new import_vscode21.EventEmitter();
  onDidChangeTreeData = this._onDidChangeTreeData.event;
  refresh() {
    this._onDidChangeTreeData.fire();
  }
};

// src/extension.ts
function activate(context) {
  console.log('Congratulations, your extension "integrationworkbench" is now active!');
  const workbenchesTreeDataProvider = new WorkbenchTreeDataProvider(context);
  vscode.window.registerWebviewViewProvider("response", {
    resolveWebviewView: (webviewView, _context, _token) => {
      webviewView.webview.options = {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, "build"),
          vscode.Uri.joinPath(context.extensionUri, "resources"),
          vscode.Uri.joinPath(context.extensionUri, "node_modules", "@vscode", "codicons")
        ]
      };
      const webviewUri = getWebviewUri(webviewView.webview, context.extensionUri, ["build", "webviews", "response.js"]);
      const globalStyleUri = getWebviewUri(webviewView.webview, context.extensionUri, ["resources", "request", "styles", "global.css"]);
      const styleUri = getWebviewUri(webviewView.webview, context.extensionUri, ["resources", "request", "styles", "response.css"]);
      const shikiUri = getWebviewUri(webviewView.webview, context.extensionUri, ["resources", "shiki"]);
      const codiconsUri = getWebviewUri(webviewView.webview, context.extensionUri, ["node_modules", "@vscode/codicons", "dist", "codicon.css"]);
      webviewView.webview.html = `
				<!DOCTYPE html>
				<html lang="en">
					<head>
						<meta charset="UTF-8"/>
	
						<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
						
						<title>Hello World!</title>
	
						<link rel="stylesheet" href="${globalStyleUri}"/>
						<link rel="stylesheet" href="${styleUri}"/>
						<link rel="stylesheet" href="${codiconsUri}"/>
					</head>
					<body>
						${(0, import_fs8.readFileSync)(
        import_path9.default.join(__filename, "..", "..", "resources", "request", "response.html"),
        {
          encoding: "utf-8"
        }
      )}
	
						<script type="text/javascript">
							window.shikiUri = "${shikiUri}";
							window.activeColorThemeKind = "${vscode.window.activeColorTheme.kind}";
						</script>
	
						<script type="module" src="${webviewUri}"></script>
					</body>
				</html>
			`;
      context.subscriptions.push(vscode.commands.registerCommand("integrationWorkbench.showResponse", (response) => {
        webviewView.webview.postMessage({
          command: "integrationWorkbench.showResponse",
          arguments: [response.getData()]
        });
      }));
    }
  });
  const workbenchTreeView = vscode.window.createTreeView("workbenches", {
    treeDataProvider: workbenchesTreeDataProvider
  });
  const workbenchesResponsesTreeDataProvider = new WorkbenchesRequestsTreeDataProvider(context);
  vscode.window.createTreeView("requests", {
    treeDataProvider: workbenchesResponsesTreeDataProvider
  });
  new CreateCollectionCommand(context);
  new CreateRequestCommand(context);
  new OpenRequestCommand(context);
  new OpenResponseCommand(context);
  new CreateWorkbenchCommand(context);
  context.subscriptions.push(vscode.commands.registerCommand("integrationWorkbench.refreshWorkbenches", () => {
    workbenchesTreeDataProvider.refresh();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("integrationWorkbench.addResponse", (workbenchResponse) => {
    workbenchesResponsesTreeDataProvider.workbenchResponses.unshift(workbenchResponse);
    workbenchesResponsesTreeDataProvider.refresh();
  }));
  context.subscriptions.push(vscode.commands.registerCommand("integrationWorkbench.refreshResponses", () => {
    workbenchesResponsesTreeDataProvider.refresh();
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
