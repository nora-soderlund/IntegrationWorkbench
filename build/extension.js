"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const WorkbenchTreeDataProvider_1 = __importDefault(require("./trees/WorkbenchTreeDataProvider"));
const WorkbenchCollectionTreeItem_1 = __importDefault(require("./trees/items/WorkbenchCollectionTreeItem"));
const WorkbenchTreeItem_1 = __importDefault(require("./trees/items/WorkbenchTreeItem"));
const GetWorkbenchStorageOption_1 = __importDefault(require("./utils/GetWorkbenchStorageOption"));
const GetUniqueFolderPath_1 = __importDefault(require("./utils/GetUniqueFolderPath"));
const GetCamelizedString_1 = __importDefault(require("./utils/GetCamelizedString"));
const Workbench_1 = require("./interfaces/workbenches/Workbench");
const Workbenches_1 = require("./Workbenches");
const crypto_1 = require("crypto");
const GetRootPath_1 = __importDefault(require("./utils/GetRootPath"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "integrationworkbench" is now active!');
    const workbenchesTreeDataProvider = new WorkbenchTreeDataProvider_1.default(context);
    const workbenchTreeView = vscode.window.createTreeView('workbenches', {
        treeDataProvider: workbenchesTreeDataProvider
    });
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.createWorkbench', async () => {
        vscode.window.showInformationMessage('Create workbench');
        const name = await vscode.window.showInputBox({
            placeHolder: "Enter the name of this workbench:",
            validateInput(value) {
                if (!value.length) {
                    return "You must enter a name for this workbench!";
                }
                return null;
            },
        });
        if (!name) {
            return;
        }
        const storageOption = await (0, GetWorkbenchStorageOption_1.default)(context, name);
        if (!storageOption) {
            return;
        }
        const uniqueWorkbenchPath = (0, GetUniqueFolderPath_1.default)(storageOption.path, (0, GetCamelizedString_1.default)(name));
        if (!uniqueWorkbenchPath) {
            vscode.window.showErrorMessage("There is too many workbenches with the same name in this storage option, please choose a different name.");
            return null;
        }
        const rootPath = (0, GetRootPath_1.default)();
        const workbench = new Workbench_1.Workbench({
            name,
            storage: {
                location: storageOption.location,
                base: (rootPath) ? (path_1.default.basename(rootPath)) : (undefined)
            },
            collections: []
        }, uniqueWorkbenchPath);
        workbench.save();
        Workbenches_1.workbenches.push(workbench);
        workbenchesTreeDataProvider.refresh();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.createCollection', (reference) => {
        vscode.window.showInformationMessage('Create collection');
        vscode.window.showInputBox({
            prompt: "Enter a collection name",
            validateInput(value) {
                if (!value.length) {
                    return "You must enter a collection name or cancel.";
                }
                return null;
            },
        }).then((value) => {
            if (!value) {
                return;
            }
            if (reference instanceof WorkbenchTreeItem_1.default) {
                reference.workbench.collections.push({
                    name: value,
                    requests: []
                });
                reference.workbench.save();
                workbenchesTreeDataProvider.refresh();
            }
        });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.createRequest', (reference) => {
        vscode.window.showInformationMessage('Create request');
        vscode.window.showInputBox({
            prompt: "Enter the request name",
            validateInput(value) {
                if (!value.length) {
                    return "You must enter a name or cancel.";
                }
                return null;
            },
        }).then((value) => {
            if (!value) {
                return;
            }
            if (reference instanceof WorkbenchCollectionTreeItem_1.default) {
                reference.collection.requests.push({
                    id: (0, crypto_1.randomUUID)(),
                    name: value,
                    type: null
                });
                reference.workbench.save();
                workbenchesTreeDataProvider.refresh();
            }
        });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.openRequest', (workbench, request, collection) => {
        if (!request.webviewPanel) {
            request.webviewPanel = vscode.window.createWebviewPanel(`request-${request.id}`, request.name, vscode.ViewColumn.One, {});
            request.webviewPanel.webview.html = (0, fs_1.readFileSync)(path_1.default.join(__filename, "..", "..", "resources", "request", "index.html"), {
                encoding: "utf-8"
            });
        }
        else {
            const columnToShowIn = vscode.window.activeTextEditor
                ? vscode.window.activeTextEditor.viewColumn
                : undefined;
            request.webviewPanel.reveal(columnToShowIn);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refresh', () => {
        workbenchesTreeDataProvider.refresh();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.openWalkthrough', () => {
        vscode.commands.executeCommand(`workbench.action.openWalkthrough`, `nora-soderlund.integrationWorkbench#workbenches.openWorkbenches`, false);
    }));
    (0, Workbenches_1.scanForWorkbenches)(context);
    //vscode.window.registerTreeDataProvider('workbenches', new WorkbenchTreeDataProvider(rootPath));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map