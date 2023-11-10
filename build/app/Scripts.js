"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const GetRootPath_1 = __importDefault(require("./utils/GetRootPath"));
const Script_1 = __importDefault(require("./scripts/Script"));
class Scripts {
    static scanForScripts(context, sendRefreshScriptsCommand = true) {
        this.loadedScripts = [];
        const rootPaths = [
            context.globalStorageUri.fsPath,
            (0, GetRootPath_1.default)()
        ];
        for (let rootPath of rootPaths) {
            if (!rootPath) {
                continue;
            }
            const folderPath = path_1.default.join(rootPath, ".workbench", "scripts");
            if (!(0, fs_1.existsSync)(folderPath)) {
                continue;
            }
            const files = (0, fs_1.readdirSync)(folderPath);
            for (let file of files) {
                if (file.endsWith(".ts")) {
                    this.loadedScripts.push(new Script_1.default(path_1.default.join(folderPath, file)));
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
exports.default = Scripts;
//# sourceMappingURL=Scripts.js.map