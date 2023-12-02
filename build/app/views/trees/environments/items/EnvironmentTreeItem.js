"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class EnvironmentTreeItem extends vscode_1.TreeItem {
    constructor(treeDataProvider, environment) {
        super(environment.data.name, vscode_1.TreeItemCollapsibleState.None);
        this.treeDataProvider = treeDataProvider;
        this.environment = environment;
        environment.treeDataViewItem = this;
        this.update();
        this.command = {
            title: "Edit script",
            command: "integrationWorkbench.openEnvironment",
            arguments: [this.environment]
        };
    }
    update() {
        this.label = this.environment.data.name;
        this.description = this.environment.data.description;
        this.contextValue = "environment";
        this.iconPath = new vscode_1.ThemeIcon("server-environment");
    }
}
exports.default = EnvironmentTreeItem;
//# sourceMappingURL=EnvironmentTreeItem.js.map