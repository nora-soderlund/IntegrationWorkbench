"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const EnvironmentTreeItem_1 = __importDefault(require("./items/EnvironmentTreeItem"));
const Environments_1 = __importDefault(require("../../../Environments"));
class EnvironmentsTreeDataProvider {
    constructor(context) {
        this.context = context;
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
            vscode_1.commands.executeCommand("integrationWorkbench.openEnvironment", this.selectAfterRefresh);
            delete this.selectAfterRefresh;
        }
        if (!element) {
            return Promise.resolve(Environments_1.default.loadedEnvironments.map((environment) => new EnvironmentTreeItem_1.default(this, environment)));
        }
        return Promise.resolve([]);
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
exports.default = EnvironmentsTreeDataProvider;
//# sourceMappingURL=EnvironmentsTreeDataProvider.js.map