"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorkbenchRequestDataTypeValidations_1 = require("../../../../../src/interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations");
function createHttpRequestBodyPanel(vscode, requestData) {
    const httpRequestBody = document.getElementById("http-request-body");
    const requestView = document.getElementById("request-view");
    const currentHttpRequestBodyRadio = requestView.querySelector(`vscode-radio[value="${requestData.data.body.type}"]`);
    currentHttpRequestBodyRadio.checked = true;
    switch (requestData.data.body.type) {
        case "none": {
            httpRequestBody.innerHTML = `
        <p>This request has no body.</p>
      `;
            break;
        }
        case "raw": {
            httpRequestBody.innerHTML = `
        <p>Raw.</p>
      `;
            break;
        }
        case "application/json": {
            // <vscode-text-area class="http-request-body-code" resize="none" rows="10"></vscode-text-area>
            httpRequestBody.innerHTML = `
        <div class="http-request-body-code">
          <div class="http-request-body-code-monaco"></div>
        </div>
      `;
            const httpRequestBodyCode = httpRequestBody.querySelector(".http-request-body-code-monaco");
            //@ts-ignore
            require(['vs/editor/editor.main'], () => {
                if ((0, WorkbenchRequestDataTypeValidations_1.isHttpRequestApplicationJsonBodyData)(requestData.data.body)) {
                    //@ts-ignore
                    const editor = monaco.editor.create(httpRequestBodyCode, {
                        value: requestData.data.body.body,
                        language: 'json',
                        theme: "vs-dark",
                        wordWrap: "bounded",
                        minimap: {
                            enabled: false
                        },
                        scrollBeyondLastLine: false
                    });
                    editor.getModel().onDidChangeContent((event) => {
                        requestData.data.body = {
                            type: "application/json",
                            body: editor.getValue()
                        };
                        vscode.postMessage({
                            command: "integrationWorkbench.changeHttpRequestBody",
                            arguments: [
                                requestData.data.body
                            ]
                        });
                    });
                }
            });
            //httpRequestBodyCode.value = requestData.data.body.body;
            break;
        }
        default: {
            httpRequestBody.innerHTML = "";
            break;
        }
    }
}
exports.default = createHttpRequestBodyPanel;
//# sourceMappingURL=CreateHttpRequestBodyPanel.js.map