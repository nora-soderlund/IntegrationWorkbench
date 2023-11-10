"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class ScriptTreeItem extends vscode_1.TreeItem {
    constructor(script) {
        super(script.name, vscode_1.TreeItemCollapsibleState.None);
        this.script = script;
        this.tooltip = `${script.name} script`;
        this.update();
        this.command = {
            title: "Edit script",
            command: "integrationWorkbench.editScript",
            arguments: [this]
        };
    }
    update() {
        this.contextValue = "script";
        this.iconPath = this.getIconPath();
        this.resourceUri = vscode_1.Uri.parse('_.js');
    }
    getIconPath() {
        return vscode_1.ThemeIcon.File;
    }
}
exports.default = ScriptTreeItem;
//# sourceMappingURL=ScriptTreeItem.js.map