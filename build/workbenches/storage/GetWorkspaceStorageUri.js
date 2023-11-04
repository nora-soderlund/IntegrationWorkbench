"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path_1 = __importDefault(require("path"));
function getWorkbenchStorageUri(workbench) {
    if (storageOption.location === "repository") {
        return vscode_1.Uri.file(path_1.default.join(workbench.storage.path, workbench.name + ".json"));
    }
}
exports.default = getWorkbenchStorageUri;
//# sourceMappingURL=GetWorkspaceStorageUri.js.map