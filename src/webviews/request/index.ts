import { isHttpRequestData } from "../../interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import createHttpRequestView from "./http/CreateHttpRequestView";
import createHttpRequestBodyPanel from "./http/body/CreateHttpRequestBodyPanel";

const { provideVSCodeDesignSystem, vsCodeButton, vsCodeTextArea, vsCodeTextField, vsCodeDropdown, vsCodeOption, vsCodePanels, vsCodePanelTab, vsCodePanelView, vsCodeRadioGroup, vsCodeRadio, vsCodeDataGrid, vsCodeDataGridRow, vsCodeDataGridCell } = require("@vscode/webview-ui-toolkit");

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeTextArea(), vsCodeTextField(), vsCodeDropdown(), vsCodeOption(), vsCodePanels(), vsCodePanelTab(), vsCodePanelView(), vsCodeRadioGroup(), vsCodeRadio(), vsCodeDataGrid(), vsCodeDataGridRow(), vsCodeDataGridCell());

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
          createHttpRequestView(vscode, requestData);
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
