import { isHttpRequestData } from "../../interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";

const { provideVSCodeDesignSystem, vsCodeButton, vsCodeTextField, vsCodeDropdown, vsCodeOption, vsCodePanels, vsCodePanelTab, vsCodePanelView } = require("@vscode/webview-ui-toolkit");

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeTextField(), vsCodeDropdown(), vsCodeOption(), vsCodePanels(), vsCodePanelTab(), vsCodePanelView());

const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

function main() {
  // To get improved type annotations/IntelliSense the associated class for
  // a given toolkit component can be imported and used to type cast a reference
  // to the element (i.e. the `as Button` syntax)
  if(isHttpRequestData(window.workbenchRequest)) {
    const httpRequestUrlInput = document.getElementById("http-request-url-input") as HTMLInputElement;
    httpRequestUrlInput.value = window.workbenchRequest.data.url ?? "";

    const httpRequestMethodDropdown = document.getElementById("http-request-method-dropdown") as HTMLSelectElement;
    httpRequestMethodDropdown.value = window.workbenchRequest.data.method;

    httpRequestMethodDropdown.addEventListener("change", () => {
      vscode.postMessage({
        command: "integrationEvent.changeHttpRequestMethod",
        arguments: [
          httpRequestMethodDropdown.value
        ]
      });
    });
  }
}
