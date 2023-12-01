"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class WorkbenchCollectionTreeItem extends vscode_1.TreeItem {
    constructor(workbench, collection) {
        super(collection.name, vscode_1.TreeItemCollapsibleState.Expanded);
        this.workbench = workbench;
        this.collection = collection;
        this.iconPath = new vscode_1.ThemeIcon("folder");
        this.tooltip = `${collection.name}: ${collection.description}`;
        this.description = collection.description;
        this.contextValue = "collection";
    }
}
exports.default = WorkbenchCollectionTreeItem;
//# sourceMappingURL=WorkbenchCollectionTreeItem.js.map