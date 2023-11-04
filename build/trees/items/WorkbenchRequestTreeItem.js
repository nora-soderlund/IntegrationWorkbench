"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
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
        this.iconPath = this.getIconPath();
        this.command = {
            title: "Open request",
            command: "integrationWorkbench.openRequest",
            arguments: [workbench, request, collection]
        };
    }
    getIconPath() {
        if (this.request.type === "HTTP") {
            const iconPath = path_1.default.join(__filename, '..', '..', '..', '..', 'resources', 'icons', 'methods', `${this.request.details.method}.png`);
            if ((0, fs_1.existsSync)(iconPath)) {
                return {
                    light: iconPath,
                    dark: iconPath
                };
            }
        }
        return new vscode_1.ThemeIcon("search-show-context");
    }
}
exports.default = WorkbenchRequestTreeItem;
//# sourceMappingURL=WorkbenchRequestTreeItem.js.map