"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createHttpRequestHeaderPanel(vscode, requestData) {
    var _a;
    const httpRequestUrlInput = document.getElementById("http-request-url-input");
    httpRequestUrlInput.value = (_a = requestData.data.url) !== null && _a !== void 0 ? _a : "";
    httpRequestUrlInput.addEventListener("change", () => {
        requestData.data.url = httpRequestUrlInput.value;
        vscode.postMessage({
            command: "integrationWorkbench.changeHttpRequestUrl",
            arguments: [
                requestData.data.url
            ]
        });
    });
    const httpRequestMethodDropdown = document.getElementById("http-request-method-dropdown");
    httpRequestMethodDropdown.value = requestData.data.method;
    httpRequestMethodDropdown.addEventListener("change", () => {
        requestData.data.method = httpRequestMethodDropdown.value;
        vscode.postMessage({
            command: "integrationWorkbench.changeHttpRequestMethod",
            arguments: [
                requestData.data.method
            ]
        });
    });
    const httpRequestSendButton = document.getElementById("http-request-send-button");
    httpRequestSendButton.addEventListener("click", () => {
        vscode.postMessage({
            command: "integrationWorkbench.sendHttpRequest",
            arguments: []
        });
    });
}
exports.default = createHttpRequestHeaderPanel;
;
//# sourceMappingURL=CreateHttpRequestHeaderPanel.js.map