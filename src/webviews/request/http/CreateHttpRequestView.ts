import { WebviewApi } from "vscode-webview";
import { WorkbenchHttpRequestData } from "../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import createHttpRequestBodyPanel from "./body/CreateHttpRequestBodyPanel";
import createHttpRequestHeaderPanel from "./header/CreateHttpRequestHeaderPanel";

export default function createHttpRequestView(vscode: WebviewApi<unknown>, requestData: WorkbenchHttpRequestData) {
  const requestView = document.getElementById("request-view")!;

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
      
      <vscode-panel-view id="http-request-parameters-panel-view">
        <vscode-data-grid aria-label="Basic" class="data-grid-unfocusable data-grid-unhoverable">
          <vscode-data-grid-row row-type="header">
            <vscode-data-grid-cell cell-type="columnheader" grid-column="1">Preview</vscode-data-grid-cell>
          </vscode-data-grid-row>

          <vscode-data-grid-row class="data-grid-buttons-hoverable">
            <vscode-data-grid-cell grid-column="1">
              https://httpbin.org/basic-auth/root/password
            </vscode-data-grid-cell>
          </vscode-data-grid-row>
        </vscode-data-grid>

        <vscode-data-grid aria-label="Basic" class="data-grid-unfocusable">
          <vscode-data-grid-row row-type="header" class="data-grid-buttons-header-row">
            <vscode-data-grid-cell cell-type="columnheader" grid-column="1">Parameter</vscode-data-grid-cell>
            
            <vscode-data-grid-cell cell-type="columnheader" grid-column="2">Value</vscode-data-grid-cell>

            <vscode-data-grid-cell grid-column="3" class="data-grid-buttons-cell">
              <vscode-button appearance="icon" aria-label="Add">
                <span class="codicon codicon-add"></span>
              </vscode-button>
            </vscode-data-grid-cell>
          </vscode-data-grid-row>

          <vscode-data-grid-row class="data-grid-buttons-hoverable">
            <vscode-data-grid-cell grid-column="1">
              <vscode-text-field type="text" placeholder="Enter the name of this parameter..." value="username"></vscode-text-field>
            </vscode-data-grid-cell>
            
            <vscode-data-grid-cell grid-column="2">
              <vscode-text-field type="text" placeholder="Enter the value of this parameter..."></vscode-text-field>
            </vscode-data-grid-cell>

            <vscode-data-grid-cell grid-column="3" class="data-grid-buttons-cell">
              <vscode-button appearance="icon" aria-label="Delete">
                <span class="codicon codicon-trashcan"></span>
              </vscode-button>
            </vscode-data-grid-cell>
          </vscode-data-grid-row>
        </vscode-data-grid>
      </vscode-panel-view>
      
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

  createHttpRequestHeaderPanel(vscode, requestData);

  const httpRequestBodyRadioGroup = requestView.querySelector<HTMLInputElement>("#http-request-body-radio")!;
  
  httpRequestBodyRadioGroup.addEventListener("change", () => {
    console.log(httpRequestBodyRadioGroup.value);

    switch(httpRequestBodyRadioGroup.value) {
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

    createHttpRequestBodyPanel(vscode, requestData);
  });

  createHttpRequestBodyPanel(vscode, requestData);
}
