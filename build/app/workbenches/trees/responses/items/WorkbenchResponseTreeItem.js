"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const WorkbenchRequestDataTypeValidations_1 = require("../../../../../src/interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations");
class WorkbenchResponseTreeItem extends vscode_1.TreeItem {
    constructor(response) {
        super(response.request.name, vscode_1.TreeItemCollapsibleState.None);
        this.response = response;
        this.tooltip = `${response.request.name} response`;
        this.update();
        this.command = {
            title: "Show response",
            command: "integrationWorkbench.showResponse",
            arguments: [this]
        };
    }
    update() {
        this.contextValue = "response-" + this.response.status;
        this.description = this.getDescription();
        this.iconPath = this.getIconPath();
    }
    getDescription() {
        const now = Date.now();
        const then = this.response.requestedAt.getTime();
        const difference = now - then;
        if (difference < 60 * 1000) {
            return "just now";
        }
        if (difference < 60 * 60 * 1000) {
            return Math.floor(difference / 1000 / 60) + " minutes ago";
        }
        return Math.floor(difference / 1000 / 60 / 60) + " hours ago";
    }
    getIconPath() {
        if (this.response.status === "done") {
            if ((0, WorkbenchRequestDataTypeValidations_1.isHttpRequestData)(this.response.request)) {
                const iconPath = path_1.default.join(__filename, '..', '..', 'resources', 'icons', 'methods', `${this.response.request.data.method}.png`);
                if ((0, fs_1.existsSync)(iconPath)) {
                    return {
                        light: iconPath,
                        dark: iconPath
                    };
                }
            }
            return new vscode_1.ThemeIcon("search-show-context");
        }
        if (this.response.status === "failed") {
            return new vscode_1.ThemeIcon("run-errors", new vscode_1.ThemeColor("terminalCommandDecoration.errorBackground"));
        }
        return new vscode_1.ThemeIcon("loading~spin", new vscode_1.ThemeColor("progressBar.background"));
    }
}
exports.default = WorkbenchResponseTreeItem;
//# sourceMappingURL=WorkbenchResponseTreeItem.js.map