"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkbenchTreeDataProvider = void 0;
const vscode_1 = require("vscode");
const path = __importStar(require("path"));
const workbenches_1 = require("../mock/workbenches");
class WorkbenchTreeDataProvider {
    workspaceRoot;
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!this.workspaceRoot) {
            vscode_1.window.showInformationMessage('Empty workspace');
        }
        if (!element) {
            return Promise.resolve(workbenches_1.workbenches.map((workbench) => new WorkbenchTreeItem(workbench)));
        }
        else {
            if (element instanceof WorkbenchCollectionTreeItem) {
                return Promise.resolve(element.collection.requests.map((request) => (new WorkbenchRequestTreeItem(element.workbench, request, element.collection))));
            }
            else if (element instanceof WorkbenchTreeItem) {
                return Promise.resolve(element.workbench.collections.map((collection) => (new WorkbenchCollectionTreeItem(element.workbench, collection))));
            }
        }
        return Promise.resolve([]);
    }
}
exports.WorkbenchTreeDataProvider = WorkbenchTreeDataProvider;
class WorkbenchTreeItem extends vscode_1.TreeItem {
    workbench;
    constructor(workbench) {
        super(workbench.name, vscode_1.TreeItemCollapsibleState.Expanded);
        this.workbench = workbench;
        this.tooltip = `${workbench.name} workbench`;
        this.description = workbench.repository;
    }
    iconPath = new vscode_1.ThemeIcon("archive");
}
class WorkbenchCollectionTreeItem extends vscode_1.TreeItem {
    workbench;
    collection;
    constructor(workbench, collection) {
        super(collection.name, vscode_1.TreeItemCollapsibleState.Expanded);
        this.workbench = workbench;
        this.collection = collection;
        this.tooltip = `${collection.name} collection`;
    }
    iconPath = new vscode_1.ThemeIcon("folder");
}
class WorkbenchRequestTreeItem extends vscode_1.TreeItem {
    workbench;
    request;
    collection;
    constructor(workbench, request, collection) {
        super(request.name, vscode_1.TreeItemCollapsibleState.None);
        this.workbench = workbench;
        this.request = request;
        this.collection = collection;
        this.tooltip = `${request.name} request`;
        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'icons', 'methods', `${request.method}.png`),
            dark: path.join(__filename, '..', '..', 'resources', 'icons', 'methods', `${request.method}.png`)
        };
    }
}
//# sourceMappingURL=TreeDataProvider.js.map