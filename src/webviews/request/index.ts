import { isHttpRequestData } from "../../interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";

const { provideVSCodeDesignSystem, vsCodeButton, vsCodeTextField, vsCodeDropdown, vsCodeOption, vsCodePanels, vsCodePanelTab, vsCodePanelView } = require("@vscode/webview-ui-toolkit");

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeTextField(), vsCodeDropdown(), vsCodeOption(), vsCodePanels(), vsCodePanelTab(), vsCodePanelView());

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
