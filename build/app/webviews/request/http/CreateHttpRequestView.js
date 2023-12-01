"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CreateHttpRequestBodyPanel_1 = __importDefault(require("./body/CreateHttpRequestBodyPanel"));
const CreateHttpRequestHeaderPanel_1 = __importDefault(require("./header/CreateHttpRequestHeaderPanel"));
const CreateHttpRequestParametersPanel_1 = __importDefault(require("./parameters/CreateHttpRequestParametersPanel"));
function createHttpRequestView(vscode, requestData) {
    const requestView = document.getElementById("request-view");
    requestView.innerHTML = `
    <header>
      <div class="header-request header-http-request">
        <vscode-dropdown id="http-request-method-dropdown">
          <vscode-option>GET</vscode-option>
          <vscode-option>DELETE</vscode-option>
          <vscode-option>PATCH</vscode-option>
          <vscode-option>PUT</vscode-option>
          <vscode-option>POST</vscode-option>
        </vscode-dropdown>

        <vscode-text-field id="http-request-url-input" type="url" placeholder="Enter the URL of this request..."></vscode-text-field>
      </div>

      <vscode-button id="http-request-send-button" class="header-send">Send HTTP Request</vscode-button>
    </header>

    <vscode-panels>
      <vscode-panel-tab id="http-request-body-panel-tab">BODY</vscode-panel-tab>
      <vscode-panel-tab id="http-request-headers-panel-tab">HEADERS</vscode-panel-tab>
      <vscode-panel-tab id="http-request-parameters-panel-tab">PARAMETERS</vscode-panel-tab>
      <vscode-panel-tab id="http-request-authorization-panel-tab">AUTHORIZATION</vscode-panel-tab>

      <vscode-panel-view id="http-request-body-panel-view">
        <vscode-radio-group id="http-request-body-radio">
          <vscode-radio value="none">None</vscode-radio>
          <vscode-radio value="raw">Raw</vscode-radio>
          <vscode-radio value="application/json">application/json</vscode-radio>
          <vscode-radio value="multipart/form-data">multipart/form-data</vscode-radio>
          <vscode-radio value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</vscode-radio>
        </vscode-radio-group>

        <div id="http-request-body">

        </div>
      </vscode-panel-view>

      <vscode-panel-view id="http-request-headers-panel-view">Headers content.</vscode-panel-view>
      
      <vscode-panel-view id="http-request-parameters-panel"></vscode-panel-view>
      
      <vscode-panel-view id="http-request-authorization-panel-view">
        <vscode-radio-group id="http-request-authorization-radio-group">
          <vscode-radio value="none">None</vscode-radio>
          <vscode-radio value="basic">Basic</vscode-radio>
          <vscode-radio value="bearer">Bearer</vscode-radio>
        </vscode-radio-group>

        <div id="http-request-authorization">

        </div>
      </vscode-panel-view>
    </vscode-panels>
  `;
    (0, CreateHttpRequestHeaderPanel_1.default)(vscode, requestData);
    const httpRequestBodyRadioGroup = requestView.querySelector("#http-request-body-radio");
    httpRequestBodyRadioGroup.addEventListener("change", () => {
        console.log(httpRequestBodyRadioGroup.value);
        switch (httpRequestBodyRadioGroup.value) {
            case "none": {
                requestData.data.body = {
                    type: "none"
                };
                break;
            }
            case "raw": {
                requestData.data.body = {
                    type: "raw",
                    body: ""
                };
                break;
            }
            case "application/json": {
                requestData.data.body = {
                    type: "application/json",
                    body: `{\n  "foo": "bar"\n}`
                };
                break;
            }
        }
        vscode.postMessage({
            command: "integrationWorkbench.changeHttpRequestBody",
            arguments: [
                requestData.data.body
            ]
        });
        (0, CreateHttpRequestBodyPanel_1.default)(vscode, requestData);
    });
    (0, CreateHttpRequestBodyPanel_1.default)(vscode, requestData);
    (0, CreateHttpRequestParametersPanel_1.default)(vscode, requestData);
}
exports.default = createHttpRequestView;
//# sourceMappingURL=CreateHttpRequestView.js.map