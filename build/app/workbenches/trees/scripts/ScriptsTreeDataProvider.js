"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const ScriptTreeItem_1 = __importDefault(require("./items/ScriptTreeItem"));
const Scripts_1 = __importDefault(require("../../../Scripts"));
class ScriptsTreeDataProvider {
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
            vscode_1.commands.executeCommand("integrationWorkbench.editScript", this.selectAfterRefresh);
            delete this.selectAfterRefresh;
        }
        if (!element) {
            return Promise.resolve(Scripts_1.default.loadedScripts.map((script) => new ScriptTreeItem_1.default(this, script)));
        }
        return Promise.resolve([]);
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
exports.default = ScriptsTreeDataProvider;
//# sourceMappingURL=ScriptsTreeDataProvider.js.map