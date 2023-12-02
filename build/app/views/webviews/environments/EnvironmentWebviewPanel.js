"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentWebviewPanel = void 0;
const vscode_1 = require("vscode");
const EnvironmentPreviewVariablesPanel_1 = __importDefault(require("./preivews/EnvironmentPreviewVariablesPanel"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const GetWebviewUri_1 = require("../../../utils/GetWebviewUri");
class EnvironmentWebviewPanel {
    constructor(context, environment) {
        this.context = context;
        this.environment = environment;
        this.disposables = [];
        this.webviewPanel = vscode_1.window.createWebviewPanel("integrationWorkbench.request", environment.data.name, vscode_1.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [
                vscode_1.Uri.joinPath(context.extensionUri, 'build'),
                vscode_1.Uri.joinPath(context.extensionUri, 'resources'),
                vscode_1.Uri.joinPath(context.extensionUri, 'node_modules', 'monaco-editor', 'min', 'vs'),
                vscode_1.Uri.joinPath(context.extensionUri, 'node_modules', '@vscode', 'codicons')
            ]
        });
        this.webviewPanel.onDidDispose(() => this.dispose(), null, this.disposables);
        const manifest = JSON.parse((0, fs_1.readFileSync)(path_1.default.join(context.extensionPath, 'build', 'asset-manifest.json'), {
            encoding: "utf-8"
        }));
        const webviewUri = (0, GetWebviewUri_1.getWebviewUri)(this.webviewPanel.webview, context.extensionUri, ["build", manifest['files']['main.js']]);
        const globalStyleUri = (0, GetWebviewUri_1.getWebviewUri)(this.webviewPanel.webview, context.extensionUri, ["resources", "request", "styles", "global.css"]);
        const monacoEditorLoaderUri = (0, GetWebviewUri_1.getWebviewUri)(this.webviewPanel.webview, context.extensionUri, ["node_modules", "monaco-editor", 'min', 'vs', 'loader.js']);
        const codiconsUri = (0, GetWebviewUri_1.getWebviewUri)(this.webviewPanel.webview, context.extensionUri, ['node_modules', '@vscode/codicons', 'dist', 'codicon.css']);
        this.webviewPanel.webview.html = `
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
            
            window.type = "environment";
          </script>

          <script src="${monacoEditorLoaderUri}"></script>

          <script src="${webviewUri}"></script>
        </body>
      </html>
    `;
        this.webviewPanel.webview.onDidReceiveMessage((message) => __awaiter(this, void 0, void 0, function* () {
            const command = message.command;
            console.debug("Received event from request webview:", command);
            switch (command) {
                case "integrationWorkbench.getRequest": {
                    this.updateEnvironment();
                    return;
                }
            }
        }), undefined, this.disposables);
        this.previewVariables = new EnvironmentPreviewVariablesPanel_1.default(this, environment);
    }
    updateEnvironment() {
        this.webviewPanel.webview.postMessage({
            command: "integrationWorkbench.updateEnvironment",
            arguments: [this.environment.data]
        });
    }
    reveal() {
        const columnToShowIn = vscode_1.window.activeTextEditor ? vscode_1.window.activeTextEditor.viewColumn : undefined;
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
        this.environment.deleteWebviewPanel();
    }
}
exports.EnvironmentWebviewPanel = EnvironmentWebviewPanel;
//# sourceMappingURL=EnvironmentWebviewPanel.js.map