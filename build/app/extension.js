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
const WorkbenchTreeDataProvider_1 = __importDefault(require("./workbenches/trees/workbenches/WorkbenchTreeDataProvider"));
const Workbenches_1 = require("./Workbenches");
const CreateCollectionCommand_1 = __importDefault(require("./commands/collections/CreateCollectionCommand"));
const CreateRequestCommand_1 = __importDefault(require("./commands/requests/CreateRequestCommand"));
const OpenRequestCommand_1 = __importDefault(require("./commands/requests/OpenRequestCommand"));
const CreateWorkbenchCommand_1 = __importDefault(require("./commands/workbenches/CreateWorkbenchCommand"));
const OpenResponseCommand_1 = __importDefault(require("./commands/responses/OpenResponseCommand"));
const WorkbenchesRequestsTreeDataProvider_1 = __importDefault(require("./workbenches/trees/responses/WorkbenchesRequestsTreeDataProvider"));
const EditCollectionNameCommand_1 = __importDefault(require("./commands/collections/EditCollectionNameCommand"));
const EditCollectionDescriptionCommand_1 = __importDefault(require("./commands/collections/EditCollectionDescriptionCommand"));
const EditRequestNameCommand_1 = __importDefault(require("./commands/requests/EditRequestNameCommand"));
const RunCollectionCommand_1 = __importDefault(require("./commands/collections/RunCollectionCommand"));
const RunRequestCommand_1 = __importDefault(require("./commands/requests/RunRequestCommand"));
const WorkbenchResponseTreeItem_1 = __importDefault(require("./workbenches/trees/responses/items/WorkbenchResponseTreeItem"));
const DeleteRequestCommand_1 = __importDefault(require("./commands/requests/DeleteRequestCommand"));
const DeleteCollectionCommand_1 = __importDefault(require("./commands/collections/DeleteCollectionCommand"));
const DeleteWorkbenchCommand_1 = __importDefault(require("./commands/workbenches/DeleteWorkbenchCommand"));
const ResponseWebviewPanel_1 = require("./panels/ResponseWebviewPanel");
const RunWorkbenchCommand_1 = __importDefault(require("./commands/workbenches/RunWorkbenchCommand"));
const ScriptsTreeDataProvider_1 = __importDefault(require("./workbenches/trees/scripts/ScriptsTreeDataProvider"));
const Scripts_1 = __importDefault(require("./Scripts"));
const CreateScriptCommand_1 = __importDefault(require("./commands/scripts/CreateScriptCommand"));
const OpenScriptCommand_1 = __importDefault(require("./commands/scripts/OpenScriptCommand"));
const EditScriptNameCommand_1 = __importDefault(require("./commands/scripts/EditScriptNameCommand"));
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
    /*vscode.window.registerWebviewViewProvider("response", {
        resolveWebviewView: (webviewView, _context, _token) => {
            webviewView.webview.options = {
                enableScripts: true,
                
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, 'build'),
          vscode.Uri.joinPath(context.extensionUri, 'resources'),
          vscode.Uri.joinPath(context.extensionUri, 'node_modules', '@vscode', 'codicons')
        ]
            };

            const webviewUri = getWebviewUri(webviewView.webview, context.extensionUri, ["build", "webviews", "response.js"]);
            const globalStyleUri = getWebviewUri(webviewView.webview, context.extensionUri, ["resources", "request", "styles", "global.css"]);
            const styleUri = getWebviewUri(webviewView.webview, context.extensionUri, ["resources", "request", "styles", "response.css"]);
            const shikiUri = getWebviewUri(webviewView.webview, context.extensionUri, ["resources", "shiki"]);
            const codiconsUri = getWebviewUri(webviewView.webview, context.extensionUri, [ 'node_modules', '@vscode/codicons', 'dist', 'codicon.css' ]);

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
                        ${readFileSync(
                            path.join(__filename, "..", "..", "resources", "request", "response.html"),
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

            let currentWorkbenchResponse: WorkbenchResponse | undefined;

            context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.showResponse', (workbenchResponseTreeItem: WorkbenchResponseTreeItem) => {
                currentWorkbenchResponse = workbenchResponseTreeItem.response;
                
                workbenchesResponsesTreeView.reveal(workbenchResponseTreeItem, {
                    select: true
                });

                webviewView.webview.postMessage({
                    command: "integrationWorkbench.showResponse",
                    arguments: [ workbenchResponseTreeItem.response.getData() ]
                });
            }));

            context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refreshResponses', (workbenchResponse: WorkbenchResponse) => {
                const workbenchResponseTreeItem = workbenchesResponsesTreeDataProvider.workbenchResponses.find((workbenchTreeView) => workbenchTreeView.response.id === workbenchResponse.id);
        
                workbenchResponseTreeItem?.update();
        
                workbenchesResponsesTreeDataProvider.refresh();

                if(currentWorkbenchResponse?.id === workbenchResponse.id) {
                    webviewView.webview.postMessage({
                        command: "integrationWorkbench.showResponse",
                        arguments: [ currentWorkbenchResponse.getData() ]
                    });
                }
            }));

            context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.deleteResponse', (reference: unknown) => {
                if(reference instanceof WorkbenchResponseTreeItem) {
                    const index = workbenchesResponsesTreeDataProvider.workbenchResponses.indexOf(reference);
        
                    if(index !== -1) {
                        workbenchesResponsesTreeDataProvider.workbenchResponses.splice(index, 1);
        
                        workbenchesResponsesTreeDataProvider.refresh();

                        if(currentWorkbenchResponse?.id === reference.response.id) {
                            currentWorkbenchResponse = undefined;

                            webviewView.webview.postMessage({
                                command: "integrationWorkbench.showResponse",
                                arguments: [ currentWorkbenchResponse ]
                            });
                        }
                    }
                    else {
                        vscode.window.showWarningMessage("Failed to find request to delete.");
                    }
                }
            }));
        }
    });*/
    new CreateCollectionCommand_1.default(context);
    new EditCollectionNameCommand_1.default(context);
    new EditCollectionDescriptionCommand_1.default(context);
    new RunCollectionCommand_1.default(context);
    new DeleteCollectionCommand_1.default(context);
    new CreateRequestCommand_1.default(context);
    new OpenRequestCommand_1.default(context);
    new EditRequestNameCommand_1.default(context);
    new RunRequestCommand_1.default(context);
    new DeleteRequestCommand_1.default(context);
    new OpenResponseCommand_1.default(context);
    new CreateWorkbenchCommand_1.default(context);
    new DeleteWorkbenchCommand_1.default(context);
    new RunWorkbenchCommand_1.default(context);
    new CreateScriptCommand_1.default(context);
    new OpenScriptCommand_1.default(context);
    new EditScriptNameCommand_1.default(context);
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refreshWorkbenches', () => {
        workbenchesTreeDataProvider.refresh();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refreshScripts', () => {
        scriptsTreeDataProvider.refresh();
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
    (0, Workbenches_1.scanForWorkbenches)(context);
    Scripts_1.default.scanForScripts(context);
    //vscode.window.registerTreeDataProvider('workbenches', new WorkbenchTreeDataProvider(rootPath));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map