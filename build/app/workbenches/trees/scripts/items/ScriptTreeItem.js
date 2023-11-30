"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
class ScriptTreeItem extends vscode_1.TreeItem {
    constructor(treeDataProvider, script) {
        super(script.getName(), vscode_1.TreeItemCollapsibleState.None);
        this.treeDataProvider = treeDataProvider;
        this.script = script;
        script.treeDataViewItem = this;
        this.update();
        this.command = {
            title: "Edit script",
            command: "integrationWorkbench.openScript",
            arguments: [this.script]
        };
    }
    update() {
        this.label = this.script.getName();
        this.contextValue = "script";
        this.iconPath = this.getIconPath();
    }
    getIconPath() {
        const iconPath = path_1.default.join(__filename, '..', '..', '..', '..', '..', '..', '..', 'resources', 'icons', 'typescript.svg');
        if ((0, fs_1.existsSync)(iconPath)) {
            return vscode_1.Uri.file(iconPath);
        }
    }
}
exports.default = ScriptTreeItem;
//# sourceMappingURL=ScriptTreeItem.js.map