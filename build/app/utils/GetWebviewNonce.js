"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getWebviewNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
exports.default = getWebviewNonce;
//# sourceMappingURL=GetWebviewNonce.js.map