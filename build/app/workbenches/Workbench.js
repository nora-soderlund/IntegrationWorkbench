"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workbench = void 0;
const fs_1 = require("fs");
const vscode_1 = require("vscode");
const path_1 = __importDefault(require("path"));
const WorkbenchCollection_1 = require("./collections/WorkbenchCollection");
const WorkbenchRequest_1 = __importDefault(require("./requests/WorkbenchRequest"));
class Workbench {
    constructor(data, path) {
        this.path = path;
        this.id = data.id;
        this.name = data.name;
        this.storage = data.storage;
        this.requests = data.requests.map((request) => WorkbenchRequest_1.default.fromData(this, request));
        this.collections = data.collections.map((collection) => new WorkbenchCollection_1.WorkbenchCollection(this, collection.id, collection.name, collection.description, collection.requests));
    }
    ;
    getMetadataPath() {
        return path_1.default.join(this.path, "workbench.json");
    }
    getData() {
        return {
            id: this.id,
            name: this.name,
            storage: this.storage,
            requests: this.requests.map((request) => request.getData()),
            collections: this.collections.map((collection) => collection.getData())
        };
    }
    save() {
        try {
            if (!(0, fs_1.existsSync)(this.path)) {
                (0, fs_1.mkdirSync)(this.path, {
                    recursive: true
                });
            }
        }
        catch (error) {
            vscode_1.window.showErrorMessage("VS Code may not have permissions to create files in the current workspace folder:\n\n" + error);
        }
        try {
            (0, fs_1.writeFileSync)(this.getMetadataPath(), JSON.stringify(this.getData(), undefined, 2));
        }
        catch (error) {
            vscode_1.window.showErrorMessage(`Failed to save workbench '${this.name}':\n\n` + error);
        }
    }
    ;
    delete() {
        try {
            (0, fs_1.rmSync)(this.path, {
                recursive: true
            });
        }
        catch (error) {
            vscode_1.window.showErrorMessage(`Failed to delete workbench '${this.name}':\n\n` + error);
        }
    }
    ;
    removeCollection(workbenchCollection) {
        const index = this.collections.indexOf(workbenchCollection);
        if (index !== -1) {
            workbenchCollection.parent.requests.push(...workbenchCollection.requests);
            this.collections.splice(index, 1);
            this.save();
            vscode_1.commands.executeCommand(`integrationWorkbench.refreshWorkbenches`);
        }
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
exports.Workbench = Workbench;
;
//# sourceMappingURL=Workbench.js.map