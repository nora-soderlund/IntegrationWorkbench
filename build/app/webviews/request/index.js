"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WorkbenchRequestDataTypeValidations_1 = require("../../../src/interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations");
const CreateHttpRequestView_1 = __importDefault(require("./http/CreateHttpRequestView"));
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
                const [requestData] = event.data.arguments;
                if ((0, WorkbenchRequestDataTypeValidations_1.isHttpRequestData)(requestData)) {
                    (0, CreateHttpRequestView_1.default)(vscode, requestData);
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
//# sourceMappingURL=index.js.map