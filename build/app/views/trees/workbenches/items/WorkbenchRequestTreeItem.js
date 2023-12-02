"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const WorkbenchHttpRequest_1 = __importDefault(require("../../../../workbenches/requests/WorkbenchHttpRequest"));
class WorkbenchRequestTreeItem extends vscode_1.TreeItem {
    constructor(workbench, request, collection) {
        super(request.name, vscode_1.TreeItemCollapsibleState.None);
        this.workbench = workbench;
        this.request = request;
        this.collection = collection;
        this.tooltip = `${request.name} request`;
        this.contextValue = "request";
        this.command = {
            title: "Open request",
            command: "integrationWorkbench.openRequest",
            arguments: [workbench, request, collection]
        };
        this.setIconPath();
    }
    getIconPath() {
        if (this.request instanceof WorkbenchHttpRequest_1.default) {
            if (this.request.data.method) {
                const iconPath = path_1.default.join(__filename, '..', '..', '..', '..', '..', '..', '..', 'resources', 'icons', 'methods', `${this.request.data.method}.png`);
                console.log(iconPath);
                if ((0, fs_1.existsSync)(iconPath)) {
                    return vscode_1.Uri.file(iconPath);
                }
            }
        }
        return new vscode_1.ThemeIcon("search-show-context");
    }
    setIconPath() {
        this.iconPath = this.getIconPath();
        if (this.iconPath instanceof vscode_1.Uri) {
            this.request.setWebviewPanelIcon(this.iconPath);
        }
    }
}
exports.default = WorkbenchRequestTreeItem;
//# sourceMappingURL=WorkbenchRequestTreeItem.js.map