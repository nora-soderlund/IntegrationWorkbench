import { isHttpRequestData } from "../../interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import createHttpRequestBodyPanel from "./http/CreateHttpRequestBodyPanel";

const { provideVSCodeDesignSystem, vsCodeButton, vsCodeTextArea, vsCodeTextField, vsCodeDropdown, vsCodeOption, vsCodePanels, vsCodePanelTab, vsCodePanelView, vsCodeRadioGroup, vsCodeRadio } = require("@vscode/webview-ui-toolkit");

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeTextArea(), vsCodeTextField(), vsCodeDropdown(), vsCodeOption(), vsCodePanels(), vsCodePanelTab(), vsCodePanelView(), vsCodeRadioGroup(), vsCodeRadio());

const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

function main() {
  window.addEventListener('message', event => {
    const { command } = event.data;

    console.debug("Received event from extension:", command);

    switch (command) {
      case 'integrationWorkbench.updateRequest': {
        const [ requestData ] = event.data.arguments;

        if(isHttpRequestData(requestData)) {
          const httpRequestUrlInput = document.getElementById("http-request-url-input") as HTMLInputElement;
          httpRequestUrlInput.value = requestData.data.url ?? "";
          httpRequestUrlInput.addEventListener("change", () => {
            requestData.data.url = httpRequestUrlInput.value;

            vscode.postMessage({
              command: "integrationWorkbench.changeHttpRequestUrl",
              arguments: [
                requestData.data.url
              ]
            });
          });
          
          const httpRequestMethodDropdown = document.getElementById("http-request-method-dropdown") as HTMLSelectElement;
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
      
          const httpRequestSendButton = document.getElementById("http-request-send-button") as HTMLButtonElement;
          httpRequestSendButton.addEventListener("click", () => {
            vscode.postMessage({
              command: "integrationWorkbench.sendHttpRequest",
              arguments: []
            });
          });

          const httpRequestBodyRadioGroup = document.getElementById("http-request-body-radio") as HTMLInputElement;

          httpRequestBodyRadioGroup.querySelector<HTMLInputElement>(`vscode-radio[value="${requestData.data.body.type}"]`)!.checked = true;

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

        break;
      }
    }
  });

  vscode.postMessage({
    command: "integrationWorkbench.getRequest",
    arguments: []
  });
}
