"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseWebviewPanel = void 0;
const vscode_1 = require("vscode");
const GetWebviewUri_1 = require("../utils/GetWebviewUri");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const extension_1 = require("../extension");
class ResponseWebviewPanel {
    constructor(context) {
        this.context = context;
        this.disposables = [];
        vscode_1.window.registerWebviewViewProvider("response", {
            resolveWebviewView: (webviewView, _context, _token) => {
                this.webviewView = webviewView;
                this.webviewView.webview.options = {
                    enableScripts: true,
                    localResourceRoots: [
                        vscode_1.Uri.joinPath(context.extensionUri, 'build'),
                        vscode_1.Uri.joinPath(context.extensionUri, 'resources'),
                        vscode_1.Uri.joinPath(context.extensionUri, 'node_modules', 'monaco-editor', 'min', 'vs'),
                        vscode_1.Uri.joinPath(context.extensionUri, 'node_modules', '@vscode', 'codicons')
                    ]
                };
                const manifest = JSON.parse((0, fs_1.readFileSync)(path_1.default.join(context.extensionPath, 'build', 'asset-manifest.json'), {
                    encoding: "utf-8"
                }));
                const webviewUri = (0, GetWebviewUri_1.getWebviewUri)(this.webviewView.webview, context.extensionUri, ["build", manifest['files']['main.js']]);
                const globalStyleUri = (0, GetWebviewUri_1.getWebviewUri)(this.webviewView.webview, context.extensionUri, ["resources", "request", "styles", "global.css"]);
                const monacoEditorLoaderUri = (0, GetWebviewUri_1.getWebviewUri)(this.webviewView.webview, context.extensionUri, ["node_modules", "monaco-editor", 'min', 'vs', 'loader.js']);
                const codiconsUri = (0, GetWebviewUri_1.getWebviewUri)(this.webviewView.webview, context.extensionUri, ['node_modules', '@vscode/codicons', 'dist', 'codicon.css']);
                this.webviewView.webview.html = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8"/>

              <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
              
              <title>Hello World!</title>

              <link rel="stylesheet" href="${globalStyleUri}"/>
              <link rel="stylesheet" href="${codiconsUri}"/>
            </head>
            <body>
              <div id="root"></div>

              <script type="text/javascript">
                window.vscode = acquireVsCodeApi();
                
                window.type = "response";
              </script>

              <script src="${monacoEditorLoaderUri}"></script>

              <script src="${webviewUri}"></script>
            </body>
          </html>
        `;
                this.webviewView.webview.onDidReceiveMessage((message) => {
                    const command = message.command;
                    console.debug("Received event from response webview:", command);
                    switch (command) {
                        case "integrationWorkbench.changeHttpRequestMethod": {
                            const [] = message.arguments;
                            return;
                        }
                        case "integrationWorkbench.showOutputLogs": {
                            extension_1.outputChannel.show();
                            break;
                        }
                    }
                }, undefined, this.disposables);
                if (this.currentResponse) {
                    this.showResponse(this.currentResponse);
                }
            }
        });
    }
    showResponse(response) {
        this.currentResponse = response;
        if (!this.webviewView) {
            return;
        }
        this.webviewView.webview.postMessage({
            command: "integrationWorkbench.showResponse",
            arguments: [this.currentResponse.getData()]
        });
    }
    disposeResponse() {
        delete this.currentResponse;
        if (!this.webviewView) {
            return;
        }
        this.webviewView.webview.postMessage({
            command: "integrationWorkbench.showResponse",
            arguments: [null]
        });
    }
}
exports.ResponseWebviewPanel = ResponseWebviewPanel;
//# sourceMappingURL=ResponseWebviewPanel.js.map