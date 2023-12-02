"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class WorkbenchesRequestsTreeDataProvider {
    constructor(context) {
        this.context = context;
        this.workbenchResponses = [];
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    getParent(element) {
        return null;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (this.selectAfterRefresh) {
            vscode_1.commands.executeCommand("integrationWorkbench.showResponse", this.selectAfterRefresh);
            delete this.selectAfterRefresh;
        }
        if (!element) {
            return Promise.resolve([
                //new WorkbenchResponsesBookmarkTreeItem(),
                ...this.workbenchResponses
            ]);
        }
        return Promise.resolve([]);
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
exports.default = WorkbenchesRequestsTreeDataProvider;
//# sourceMappingURL=WorkbenchesRequestsTreeDataProvider.js.map