"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const vscode_1 = require("vscode");
class Script {
    constructor(filePath) {
        this.filePath = filePath;
        const parsedPath = path_1.default.parse(filePath);
        this.name = parsedPath.base;
        this.directory = parsedPath.dir;
    }
    save(script) {
        try {
            if (!(0, fs_1.existsSync)(this.directory)) {
                (0, fs_1.mkdirSync)(this.directory, {
                    recursive: true
                });
            }
        }
        catch (error) {
            vscode_1.window.showErrorMessage("VS Code may not have permissions to create files in the current workspace folder:\n\n" + error);
        }
        try {
            (0, fs_1.writeFileSync)(this.filePath, script);
        }
        catch (error) {
            vscode_1.window.showErrorMessage(`Failed to save workbench '${this.name}':\n\n` + error);
        }
    }
}
exports.default = Script;
//# sourceMappingURL=Script.js.map