"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const WorkbenchRequestDataTypeValidations_1 = require("../../../src/interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations");
const RequestWebviewPanel_1 = require("../../panels/RequestWebviewPanel");
const WorkbenchHttpRequest_1 = __importDefault(require("./WorkbenchHttpRequest"));
class WorkbenchRequest {
    constructor(parent, id, name) {
        this.parent = parent;
        this.id = id;
        this.name = name;
    }
    getData() {
        return {
            id: this.id,
            name: this.name,
            type: "HTTP",
            data: {
                method: "",
                parameters: [],
                parametersAutoRefresh: false,
                authorization: {
                    type: "none"
                },
                headers: [
                    {
                        name: "Content-Type",
                        value: "application/json"
                    }
                ],
                body: {
                    type: "none"
                }
            }
        };
    }
    static fromData(parent, data) {
        if ((0, WorkbenchRequestDataTypeValidations_1.isHttpRequestData)(data)) {
            return WorkbenchHttpRequest_1.default.fromData(parent, data);
        }
        throw new Error("Tried to parse invalid request type.");
    }
    send() {
        throw new Error("Not implemented.");
    }
    showWebviewPanel(context) {
        var _a;
        if (!this.requestWebviewPanel) {
            this.requestWebviewPanel = new RequestWebviewPanel_1.RequestWebviewPanel(context, this);
            if (((_a = this.treeDataViewItem) === null || _a === void 0 ? void 0 : _a.iconPath) instanceof vscode_1.Uri) {
                this.setWebviewPanelIcon(this.treeDataViewItem.iconPath);
            }
        }
        else {
            this.requestWebviewPanel.reveal();
        }
        vscode_1.commands.executeCommand("integrationWorkbench.openResponse", this);
    }
    setWebviewPanelIcon(icon) {
        if (this.requestWebviewPanel) {
            this.requestWebviewPanel.webviewPanel.iconPath = icon;
        }
    }
    setName(name) {
        var _a;
        this.name = name;
        if (this.requestWebviewPanel) {
            this.requestWebviewPanel.webviewPanel.title = name;
        }
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.save();
    }
    deleteWebviewPanel() {
        delete this.requestWebviewPanel;
    }
    disposeWebviewPanel() {
        var _a;
        (_a = this.requestWebviewPanel) === null || _a === void 0 ? void 0 : _a.dispose();
    }
}
exports.default = WorkbenchRequest;
;
//# sourceMappingURL=WorkbenchRequest.js.map