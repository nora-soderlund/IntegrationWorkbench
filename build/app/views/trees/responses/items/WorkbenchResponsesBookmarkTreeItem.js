"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class WorkbenchResponsesBookmarkTreeItem extends vscode_1.TreeItem {
    constructor() {
        super("Bookmarks", vscode_1.TreeItemCollapsibleState.None);
        this.tooltip = `Response Bookmarks`;
        this.iconPath = new vscode_1.ThemeIcon("bookmark");
    }
}
exports.default = WorkbenchResponsesBookmarkTreeItem;
//# sourceMappingURL=WorkbenchResponsesBookmarkTreeItem.js.map