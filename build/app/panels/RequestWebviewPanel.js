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
exports.RequestWebviewPanel = void 0;
const vscode_1 = require("vscode");
const GetWebviewUri_1 = require("../utils/GetWebviewUri");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const WorkbenchHttpRequest_1 = __importDefault(require("../workbenches/requests/WorkbenchHttpRequest"));
const Scripts_1 = __importDefault(require("../Scripts"));
class RequestWebviewPanel {
    constructor(context, request) {
        this.context = context;
        this.request = request;
        this.disposables = [];
        this.webviewPanel = vscode_1.window.createWebviewPanel("integrationWorkbench.request", request.name, vscode_1.ViewColumn.One, {
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
            
            window.type = "request";
          </script>

          <script src="${monacoEditorLoaderUri}"></script>

          <script src="${webviewUri}"></script>
        </body>
      </html>
    `;
        this.webviewPanel.webview.onDidReceiveMessage((message) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const command = message.command;
            console.debug("Received event from request webview:", command);
            switch (command) {
                case "integrationWorkbench.changeHttpRequestMethod": {
                    const [method] = message.arguments;
                    if (this.request instanceof WorkbenchHttpRequest_1.default) {
                        this.request.setMethod(method);
                    }
                    this.webviewPanel.webview.postMessage({
                        command: "integrationWorkbench.updateRequest",
                        arguments: [this.request.getData()]
                    });
                    return;
                }
                case "integrationWorkbench.changeHttpRequestUrl": {
                    const [url] = message.arguments;
                    if (this.request instanceof WorkbenchHttpRequest_1.default) {
                        this.request.setUrl(url);
                    }
                    this.webviewPanel.webview.postMessage({
                        command: "integrationWorkbench.updateRequest",
                        arguments: [this.request.getData()]
                    });
                    return;
                }
                case "integrationWorkbench.changeHttpRequestHeaders": {
                    const [headers] = message.arguments;
                    if (this.request instanceof WorkbenchHttpRequest_1.default) {
                        this.request.setHeaders(headers);
                    }
                    this.webviewPanel.webview.postMessage({
                        command: "integrationWorkbench.updateRequest",
                        arguments: [this.request.getData()]
                    });
                    return;
                }
                case "integrationWorkbench.changeHttpRequestParameters": {
                    const [parameters] = message.arguments;
                    if (this.request instanceof WorkbenchHttpRequest_1.default) {
                        this.request.setParameters(parameters);
                        if (this.request.data.parametersAutoRefresh) {
                            this.webviewPanel.webview.postMessage({
                                command: "integrationWorkbench.updateHttpRequestPreviewUrl",
                                arguments: [yield this.request.getParsedUrl(new AbortController())]
                            });
                        }
                    }
                    this.webviewPanel.webview.postMessage({
                        command: "integrationWorkbench.updateRequest",
                        arguments: [this.request.getData()]
                    });
                    return;
                }
                case "integrationWorkbench.changeHttpRequestBody": {
                    const [bodyData] = message.arguments;
                    console.log(bodyData);
                    if (this.request instanceof WorkbenchHttpRequest_1.default) {
                        this.request.setBody(bodyData);
                    }
                    this.webviewPanel.webview.postMessage({
                        command: "integrationWorkbench.updateRequest",
                        arguments: [this.request.getData()]
                    });
                    return;
                }
                case "integrationWorkbench.changeHttpRequestAuthorization": {
                    const [authorizationData] = message.arguments;
                    if (this.request instanceof WorkbenchHttpRequest_1.default) {
                        this.request.setAuthorization(authorizationData);
                    }
                    this.webviewPanel.webview.postMessage({
                        command: "integrationWorkbench.updateRequest",
                        arguments: [this.request.getData()]
                    });
                    return;
                }
                case "integrationWorkbench.sendHttpRequest": {
                    this.request.send();
                    return;
                }
                case "integrationWorkbench.getRequest": {
                    this.webviewPanel.webview.postMessage({
                        command: "integrationWorkbench.updateRequest",
                        arguments: [this.request.getData()]
                    });
                    return;
                }
                case "integrationWorkbench.getHttpRequestPreviewUrl": {
                    if (this.request instanceof WorkbenchHttpRequest_1.default) {
                        this.webviewPanel.webview.postMessage({
                            command: "integrationWorkbench.updateHttpRequestPreviewUrl",
                            arguments: [yield this.request.getParsedUrl(new AbortController())]
                        });
                    }
                    return;
                }
                case "integrationWorkbench.getScriptLibraries": {
                    this.webviewPanel.webview.postMessage({
                        command: "integrationWorkbench.updateScriptLibraries",
                        arguments: [
                            Scripts_1.default.loadedScripts.filter((script) => script.declaration).map((script) => {
                                return {
                                    fileName: `ts:${script.data.name}.d.ts`,
                                    content: script.declaration
                                };
                            }).concat([
                                {
                                    fileName: "ts:environment.d.ts",
                                    content: "declare const process: { env: { HELLO: string; }; };"
                                }
                            ])
                        ]
                    });
                    return;
                }
                case "integrationWorkbench.getScript": {
                    this.webviewPanel.webview.postMessage({
                        command: "integrationWorkbench.updateScript",
                        arguments: [(_a = this.currentScript) === null || _a === void 0 ? void 0 : _a.getContentData()]
                    });
                    return;
                }
                case "integrationWorkbench.changeScriptContent": {
                    const [content] = message.arguments;
                    if (this.currentScript) {
                        this.currentScript.setContent(content);
                        this.setCurrentScript(this.currentScript);
                    }
                    return;
                }
                case "integrationWorkbench.getScriptDeclarations": {
                    console.log("TEST");
                    const scriptDeclarations = yield Promise.allSettled(Scripts_1.default.loadedScripts.map((script) => __awaiter(this, void 0, void 0, function* () { return yield script.getDeclarationData(); })));
                    console.log("TEST2", scriptDeclarations);
                    this.webviewPanel.webview.postMessage({
                        command: "integrationWorkbench.updateScriptDeclarations",
                        arguments: [
                            scriptDeclarations.filter((scriptDeclaration) => scriptDeclaration.status === "fulfilled").map((scriptDeclaration) => scriptDeclaration.value).concat([
                                {
                                    name: "ts:environment.d.ts",
                                    declaration: "declare const process: { env: { HELLO: string; }; };"
                                }
                            ])
                        ]
                    });
                    return;
                }
                case "integrationWorkbench.setHttpRequestParameterAutoRefresh": {
                    if (this.request instanceof WorkbenchHttpRequest_1.default) {
                        const [enabled] = message.arguments;
                        this.request.data.parametersAutoRefresh = enabled;
                        (_b = this.request.parent) === null || _b === void 0 ? void 0 : _b.save();
                        this.webviewPanel.webview.postMessage({
                            command: "integrationWorkbench.updateRequest",
                            arguments: [this.request.getData()]
                        });
                    }
                    return;
                }
            }
        }), undefined, this.disposables);
    }
    setCurrentScript(script) {
        this.currentScript = script;
        this.webviewPanel.webview.postMessage({
            command: "integrationWorkbench.updateScript",
            arguments: [this.currentScript.getData()]
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
        this.request.deleteWebviewPanel();
    }
}
exports.RequestWebviewPanel = RequestWebviewPanel;
//# sourceMappingURL=RequestWebviewPanel.js.map