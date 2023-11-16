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
        const rootPath = (0, GetRootPath_1.default)();
        if (rootPath) {
            const folderPath = path_1.default.join(rootPath, ".workbench", "scripts");
            if (!(0, fs_1.existsSync)(folderPath)) {
                return;
            }
            const files = (0, fs_1.readdirSync)(folderPath);
            for (let file of files) {
                if (file.endsWith(".json")) {
                    const dataPath = path_1.default.join(folderPath, file);
                    const data = JSON.parse((0, fs_1.readFileSync)(dataPath, {
                        encoding: "utf-8"
                    }));
                    const script = new Script_1.default(rootPath, {
                        name: data.name,
                        description: data.description,
                        type: data.type
                    });
                    switch (data.type) {
                        case "typescript": {
                            const typescriptPath = path_1.default.join(folderPath, script.data.name + '.ts');
                            if ((0, fs_1.existsSync)(typescriptPath)) {
                                script.typescript = (0, fs_1.readFileSync)(typescriptPath, {
                                    encoding: "utf-8"
                                });
                            }
                            const javascriptPath = path_1.default.join(folderPath, 'build', script.data.name + '.js');
                            if ((0, fs_1.existsSync)(javascriptPath)) {
                                script.javascript = (0, fs_1.readFileSync)(javascriptPath, {
                                    encoding: "utf-8"
                                });
                            }
                            const declarationPath = path_1.default.join(folderPath, 'build', script.data.name + '.d.ts');
                            if ((0, fs_1.existsSync)(declarationPath)) {
                                script.declaration = (0, fs_1.readFileSync)(declarationPath, {
                                    encoding: "utf-8"
                                });
                            }
                            break;
                        }
                    }
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
exports.default = Scripts;
//# sourceMappingURL=Scripts.js.map