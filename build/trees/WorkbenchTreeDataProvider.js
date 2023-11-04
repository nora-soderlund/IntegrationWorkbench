"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const WorkbenchTreeItem_1 = __importDefault(require("./items/WorkbenchTreeItem"));
const WorkbenchRequestTreeItem_1 = __importDefault(require("./items/WorkbenchRequestTreeItem"));
const WorkbenchCollectionTreeItem_1 = __importDefault(require("./items/WorkbenchCollectionTreeItem"));
const Workbenches_1 = require("../Workbenches");
class WorkbenchTreeDataProvider {
    context;
    constructor(context) {
        this.context = context;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            return Promise.resolve((0, Workbenches_1.scanForWorkbenches)(this.context, false).map((workbench) => new WorkbenchTreeItem_1.default(workbench)));
        }
        else {
            if (element instanceof WorkbenchCollectionTreeItem_1.default) {
                return Promise.resolve(element.collection.requests.map((request) => (new WorkbenchRequestTreeItem_1.default(element.workbench, request, element.collection))));
            }
            else if (element instanceof WorkbenchTreeItem_1.default) {
                return Promise.resolve(element.workbench.collections.map((collection) => (new WorkbenchCollectionTreeItem_1.default(element.workbench, collection))));
            }
        }
        return Promise.resolve([]);
    }
    _onDidChangeTreeData = new vscode_1.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
exports.default = WorkbenchTreeDataProvider;
//# sourceMappingURL=WorkbenchTreeDataProvider.js.map