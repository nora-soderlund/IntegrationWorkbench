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
exports.deactivate = exports.activate = exports.outputChannel = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const WorkbenchTreeDataProvider_1 = __importDefault(require("./views/trees/workbenches/WorkbenchTreeDataProvider"));
const Workbenches_1 = require("./instances/Workbenches");
const WorkbenchesRequestsTreeDataProvider_1 = __importDefault(require("./views/trees/responses/WorkbenchesRequestsTreeDataProvider"));
const WorkbenchResponseTreeItem_1 = __importDefault(require("./views/trees/responses/items/WorkbenchResponseTreeItem"));
const ResponseWebviewPanel_1 = require("./views/webviews/ResponseWebviewPanel");
const ScriptsTreeDataProvider_1 = __importDefault(require("./views/trees/scripts/ScriptsTreeDataProvider"));
const Scripts_1 = __importDefault(require("./instances/Scripts"));
const Environments_1 = __importDefault(require("./instances/Environments"));
const EnvironmentsTreeDataProvider_1 = __importDefault(require("./views/trees/environments/EnvironmentsTreeDataProvider"));
const Commands_1 = __importDefault(require("./instances/Commands"));
exports.outputChannel = vscode.window.createOutputChannel("Integration Workbench", {
    log: true
});
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
    const workbenchesResponsesTreeDataProvider = new WorkbenchesRequestsTreeDataProvider_1.default(context);
    const workbenchesResponsesTreeView = vscode.window.createTreeView('requests', {
        treeDataProvider: workbenchesResponsesTreeDataProvider
    });
    const scriptsTreeDataProvider = new ScriptsTreeDataProvider_1.default(context);
    const scriptsTreeView = vscode.window.createTreeView('scripts', {
        treeDataProvider: scriptsTreeDataProvider
    });
    const environmentsTreeDataProvider = new EnvironmentsTreeDataProvider_1.default(context);
    const environmentsTreeView = vscode.window.createTreeView('environments', {
        treeDataProvider: environmentsTreeDataProvider
    });
    const workbenchResponseWebviewPanel = new ResponseWebviewPanel_1.ResponseWebviewPanel(context);
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.showResponse', (workbenchResponseTreeItem) => {
        workbenchesResponsesTreeView.reveal(workbenchResponseTreeItem, {
            select: true
        });
        workbenchResponseWebviewPanel.showResponse(workbenchResponseTreeItem.response);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refreshResponses', (workbenchResponse) => {
        var _a;
        const workbenchResponseTreeItem = workbenchesResponsesTreeDataProvider.workbenchResponses.find((workbenchTreeView) => workbenchTreeView.response.id === workbenchResponse.id);
        workbenchResponseTreeItem === null || workbenchResponseTreeItem === void 0 ? void 0 : workbenchResponseTreeItem.update();
        workbenchesResponsesTreeDataProvider.refresh();
        if (((_a = workbenchResponseWebviewPanel.currentResponse) === null || _a === void 0 ? void 0 : _a.id) === workbenchResponse.id) {
            workbenchResponseWebviewPanel.showResponse(workbenchResponse);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.deleteResponse', (reference) => {
        var _a;
        if (reference instanceof WorkbenchResponseTreeItem_1.default) {
            const index = workbenchesResponsesTreeDataProvider.workbenchResponses.indexOf(reference);
            if (index !== -1) {
                workbenchesResponsesTreeDataProvider.workbenchResponses.splice(index, 1);
                workbenchesResponsesTreeDataProvider.refresh();
                if (((_a = workbenchResponseWebviewPanel.currentResponse) === null || _a === void 0 ? void 0 : _a.id) === reference.response.id) {
                    workbenchResponseWebviewPanel.disposeResponse();
                }
            }
            else {
                vscode.window.showWarningMessage("Failed to find request to delete.");
            }
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refreshWorkbenches', () => {
        workbenchesTreeDataProvider.refresh();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refreshScripts', () => {
        scriptsTreeDataProvider.refresh();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refreshEnvironments', () => {
        environmentsTreeDataProvider.refresh();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.addResponse', (workbenchResponse) => {
        const workbenchResponseTreeItem = new WorkbenchResponseTreeItem_1.default(workbenchResponse);
        workbenchesResponsesTreeDataProvider.workbenchResponses.unshift(workbenchResponseTreeItem);
        workbenchesResponsesTreeDataProvider.selectAfterRefresh = workbenchResponseTreeItem;
        workbenchesResponsesTreeDataProvider.refresh();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.openWalkthrough', () => {
        vscode.commands.executeCommand(`workbench.action.openWalkthrough`, `nora-soderlund.integrationWorkbench#workbenches.openWorkbenches`, false);
    }));
    Commands_1.default.register(context);
    (0, Workbenches_1.scanForWorkbenches)(context);
    Scripts_1.default.scanForScripts();
    Scripts_1.default.buildScript("");
    Environments_1.default.scan();
    Environments_1.default.register(context);
    //vscode.window.registerTreeDataProvider('workbenches', new WorkbenchTreeDataProvider(rootPath));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map