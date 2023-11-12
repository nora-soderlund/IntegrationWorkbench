"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path_1 = __importDefault(require("path"));
class WorkbenchTreeItem extends vscode_1.TreeItem {
    constructor(workbench) {
        super(workbench.name, vscode_1.TreeItemCollapsibleState.Expanded);
        this.workbench = workbench;
        this.tooltip = `${workbench.name} workbench`;
        this.description = path_1.default.basename(path_1.default.dirname(path_1.default.dirname(path_1.default.dirname(workbench.path))));
        this.contextValue = "workbench";
    }
}
exports.default = WorkbenchTreeItem;
//# sourceMappingURL=WorkbenchTreeItem.js.map