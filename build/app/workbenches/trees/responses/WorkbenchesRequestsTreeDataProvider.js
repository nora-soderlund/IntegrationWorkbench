"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const WorkbenchResponsesBookmarkTreeItem_1 = __importDefault(require("./items/WorkbenchResponsesBookmarkTreeItem"));
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
                new WorkbenchResponsesBookmarkTreeItem_1.default(),
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