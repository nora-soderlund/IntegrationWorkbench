"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebviewUri = void 0;
const vscode_1 = require("vscode");
function getWebviewUri(webview, extensionUri, pathList) {
    return webview.asWebviewUri(vscode_1.Uri.joinPath(extensionUri, ...pathList));
}
exports.getWebviewUri = getWebviewUri;
//# sourceMappingURL=GetWebviewUri.js.map