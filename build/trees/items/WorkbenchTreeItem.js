"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class WorkbenchTreeItem extends vscode_1.TreeItem {
    workbench;
    constructor(workbench) {
        super(workbench.name, vscode_1.TreeItemCollapsibleState.Expanded);
        this.workbench = workbench;
        this.tooltip = `${workbench.name} workbench`;
        this.description = workbench.storage.base;
        this.contextValue = "workbench";
    }
}
exports.default = WorkbenchTreeItem;
//# sourceMappingURL=WorkbenchTreeItem.js.map