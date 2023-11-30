"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const GetRootPath_1 = __importDefault(require("./utils/GetRootPath"));
const TypescriptScript_1 = __importDefault(require("./scripts/TypescriptScript"));
class Scripts {
    static getScriptsPath(rootPath) {
        return path_1.default.join(rootPath, ".workbench/", "scripts/");
    }
    static createScriptsFolder(rootPath) {
        const scriptsPath = this.getScriptsPath(rootPath);
        if (!(0, fs_1.existsSync)(scriptsPath)) {
            (0, fs_1.mkdirSync)(scriptsPath, {
                recursive: true
            });
        }
        return scriptsPath;
    }
    ;
    static scanForScripts(sendRefreshScriptsCommand = true) {
        this.loadedScripts = [];
        const rootPath = (0, GetRootPath_1.default)();
        if (rootPath) {
            const folderPath = path_1.default.join(rootPath, ".workbench", "scripts");
            if (!(0, fs_1.existsSync)(folderPath)) {
                return;
            }
            const files = (0, fs_1.readdirSync)(folderPath);
            for (let file of files) {
                if (file.endsWith(".ts")) {
                    const filePath = path_1.default.join(folderPath, file);
                    const script = new TypescriptScript_1.default(filePath);
                    this.loadedScripts.push(script);
                }
            }
        }
        if (sendRefreshScriptsCommand) {
            vscode_1.commands.executeCommand(`integrationWorkbench.refreshScripts`);
        }
        return this.loadedScripts;
    }
}
Scripts.loadedScripts = [];
Scripts.loadedDependencies = [];
exports.default = Scripts;
//# sourceMappingURL=Scripts.js.map