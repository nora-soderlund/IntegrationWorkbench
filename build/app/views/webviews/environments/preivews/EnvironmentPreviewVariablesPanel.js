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
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const extension_1 = require("../../../../extension");
class EnvironmentPreviewVariablesPanel {
    constructor(environmentWebviewPanel, environment) {
        this.environmentWebviewPanel = environmentWebviewPanel;
        this.environment = environment;
        this.statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 100);
        this.environmentWebviewPanel.webviewPanel.onDidChangeViewState((event) => {
            if (event.webviewPanel.active) {
                this.statusBarItem.show();
            }
            else {
                this.statusBarItem.hide();
            }
        });
        this.environmentWebviewPanel.disposables.push(this.statusBarItem);
        this.environmentWebviewPanel.webviewPanel.webview.onDidReceiveMessage(({ command }) => __awaiter(this, void 0, void 0, function* () {
            switch (command) {
                case "integrationWorkbench.getHttpRequestPreviewVariables": {
                    this.updatePreviewVariables();
                    return;
                }
            }
        }));
    }
    updatePreviewVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            this.statusBarItem.text = "$(loading~spin) Building preview variables...";
            this.statusBarItem.show();
            let previewHeadersData;
            const timestamp = performance.now();
            console.log("try");
            try {
                console.log("get parsed headers");
                const headers = yield this.environment.getParsedVariables(new AbortController());
                console.log("succeed");
                previewHeadersData = {
                    success: true,
                    duration: performance.now() - timestamp,
                    headers
                };
            }
            catch (error) {
                if (error instanceof Error) {
                    extension_1.outputChannel.error(error);
                    //this.statusBarItem.text = "$(error) Failed to build preview";
                    //this.statusBarItem.backgroundColor = new ThemeColor("statusBarItem.errorBackground");
                    //this.statusBarItem.color = new ThemeColor("statusBarItem.errorForeground");
                    previewHeadersData = {
                        success: false,
                        error: error.message,
                        duration: performance.now() - timestamp
                    };
                }
                else {
                    previewHeadersData = {
                        success: false,
                        duration: performance.now() - timestamp
                    };
                }
            }
            this.environmentWebviewPanel.webviewPanel.webview.postMessage({
                command: "integrationWorkbench.updateHttpRequestPreviewHeaders",
                arguments: [previewHeadersData]
            });
            console.log("send update");
            this.statusBarItem.text = "";
            this.statusBarItem.hide();
        });
    }
}
exports.default = EnvironmentPreviewVariablesPanel;
//# sourceMappingURL=EnvironmentPreviewVariablesPanel.js.map