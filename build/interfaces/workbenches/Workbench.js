"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workbench = void 0;
const fs_1 = require("fs");
const vscode_1 = require("vscode");
const path_1 = __importDefault(require("path"));
class Workbench {
    path;
    name;
    storage;
    collections;
    constructor(input, path) {
        this.path = path;
        this.name = input.name;
        this.storage = input.storage;
        this.collections = input.collections;
    }
    ;
    getMetadataPath() {
        return path_1.default.join(this.path, "workbench.json");
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
            (0, fs_1.writeFileSync)(this.getMetadataPath(), JSON.stringify({
                name: this.name,
                storage: this.storage,
                collections: this.collections.map((collection) => {
                    return {
                        name: collection.name,
                        requests: collection.requests.map((request) => {
                            const clonedRequest = { ...request };
                            delete clonedRequest.webviewPanel;
                            return clonedRequest;
                        })
                    };
                })
            }, undefined, 2));
        }
        catch (error) {
            vscode_1.window.showErrorMessage(`Failed to save workbench '${this.name}':\n\n` + error);
        }
    }
    ;
}
exports.Workbench = Workbench;
;
//# sourceMappingURL=Workbench.js.map