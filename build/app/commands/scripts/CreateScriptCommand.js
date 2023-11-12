"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const Script_1 = __importDefault(require("../../scripts/Script"));
const Scripts_1 = __importDefault(require("../../Scripts"));
const GetRootPath_1 = __importDefault(require("../../utils/GetRootPath"));
class CreateScriptCommand {
    constructor(context) {
        this.context = context;
        context.subscriptions.push(vscode_1.commands.registerCommand('integrationWorkbench.createScript', this.handle.bind(this)));
    }
    handle() {
        return __awaiter(this, void 0, void 0, function* () {
            const rootPath = (0, GetRootPath_1.default)();
            if (!rootPath) {
                vscode_1.window.showErrorMessage("You must be in a workspace to create a script!");
                return;
            }
            const scriptsPath = path_1.default.join(rootPath, ".workbench/", "scripts/");
            try {
                if (!(0, fs_1.existsSync)(scriptsPath)) {
                    (0, fs_1.mkdirSync)(scriptsPath, {
                        recursive: true
                    });
                }
                const scriptGitignoreFile = path_1.default.join(rootPath, ".workbench/", "scripts/", ".gitignore");
                if (!(0, fs_1.existsSync)(scriptGitignoreFile)) {
                    (0, fs_1.writeFileSync)(scriptGitignoreFile, "# This is an automatically created file, do not make permanent changes here.\nbuild/", {
                        encoding: "utf-8"
                    });
                }
            }
            catch (error) {
                vscode_1.window.showErrorMessage("Failed to create workbenches folder: " + error);
                return;
            }
            const name = yield vscode_1.window.showInputBox({
                placeHolder: "Enter the name of this script:",
                validateInput(value) {
                    if (!value.length) {
                        return "You must enter a name for this script!";
                    }
                    if (/[^A-Za-z0-9_-]/.test(value)) {
                        return "You must only enter a generic file name.";
                    }
                    if ((0, fs_1.existsSync)(path_1.default.join(scriptsPath, value + ".ts"))) {
                        return "There already exists a script with this name in this folder!";
                    }
                    return null;
                },
            });
            if (!name) {
                return;
            }
            const filePath = path_1.default.join(scriptsPath, name + ".ts");
            (0, fs_1.writeFileSync)(filePath, `function ${name}() {\n  // Your code goes here...\n}\n`);
            const script = new Script_1.default(filePath);
            Scripts_1.default.loadedScripts.push(script);
            vscode_1.commands.executeCommand("integrationWorkbench.refreshScripts");
        });
    }
    ;
}
exports.default = CreateScriptCommand;
//# sourceMappingURL=CreateScriptCommand.js.map