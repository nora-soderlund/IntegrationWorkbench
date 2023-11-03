"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class WorkbenchCollectionTreeItem extends vscode_1.TreeItem {
    workbench;
    collection;
    constructor(workbench, collection) {
        super(collection.name, vscode_1.TreeItemCollapsibleState.Expanded);
        this.workbench = workbench;
        this.collection = collection;
        this.tooltip = `${collection.name} collection`;
        this.contextValue = "collection";
    }
    iconPath = new vscode_1.ThemeIcon("folder");
}
exports.default = WorkbenchCollectionTreeItem;
//# sourceMappingURL=WorkbenchCollectionTreeItem.js.map