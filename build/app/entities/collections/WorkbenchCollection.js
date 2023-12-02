"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkbenchCollection = void 0;
const vscode_1 = require("vscode");
const WorkbenchRequest_1 = __importDefault(require("../requests/WorkbenchRequest"));
class WorkbenchCollection {
    constructor(parent, id, name, description, requests) {
        this.parent = parent;
        this.id = id;
        this.name = name;
        this.description = description;
        this.requests = requests.map((request) => WorkbenchRequest_1.default.fromData(this, request));
    }
    getData() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            requests: this.requests.map((request) => request.getData())
        };
    }
    save() {
        this.parent.save();
    }
    removeRequest(workbenchRequest) {
        const index = this.requests.indexOf(workbenchRequest);
        if (index !== -1) {
            workbenchRequest.disposeWebviewPanel();
            this.requests.splice(index, 1);
            this.save();
            vscode_1.commands.executeCommand(`integrationWorkbench.refreshWorkbenches`);
        }
    }
}
exports.WorkbenchCollection = WorkbenchCollection;
//# sourceMappingURL=WorkbenchCollection.js.map