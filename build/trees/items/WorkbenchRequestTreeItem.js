"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path_1 = __importDefault(require("path"));
class WorkbenchRequestTreeItem extends vscode_1.TreeItem {
    workbench;
    request;
    collection;
    constructor(workbench, request, collection) {
        super(request.name, vscode_1.TreeItemCollapsibleState.None);
        this.workbench = workbench;
        this.request = request;
        this.collection = collection;
        this.tooltip = `${request.name} request`;
        this.iconPath = {
            light: path_1.default.join(__filename, '..', '..', '..', '..', 'resources', 'icons', 'methods', `${request.method}.png`),
            dark: path_1.default.join(__filename, '..', '..', '..', '..', 'resources', 'icons', 'methods', `${request.method}.png`)
        };
    }
}
exports.default = WorkbenchRequestTreeItem;
//# sourceMappingURL=WorkbenchRequestTreeItem.js.map