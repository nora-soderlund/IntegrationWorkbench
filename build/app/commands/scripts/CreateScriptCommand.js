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
const TypescriptScript_1 = __importDefault(require("../../scripts/TypescriptScript"));
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
            const scriptsPath = Scripts_1.default.createScriptsFolder(rootPath);
            const scriptType = yield vscode_1.window.showQuickPick([
                "TypeScript"
            ], {
                canPickMany: false,
                title: "Select the type of script to create:"
            });
            if (!scriptType) {
                return;
            }
            const name = yield vscode_1.window.showInputBox({
                placeHolder: "Enter the name of this script:",
                validateInput(value) {
                    if (!value.length) {
                        return "You must enter a name for this script!";
                    }
                    if (scriptType === "TypeScript") {
                        if (!value.endsWith('.ts')) {
                            return "Script name must end with '.ts' for TypeScript files!";
                        }
                    }
                    const nameValue = value.substring(0, value.length - 3);
                    if (/[^A-Za-z0-9_-]/.test(nameValue)) {
                        return "You must only enter a generic file name.";
                    }
                    if ((0, fs_1.existsSync)(path_1.default.join(scriptsPath, value))) {
                        return "There already exists a script with this name in this folder!";
                    }
                    return null;
                },
            });
            if (!name) {
                return;
            }
            const filePath = path_1.default.join(scriptsPath, name);
            const script = new TypescriptScript_1.default(filePath);
            script.saveScript(`export async function ${script.getNameWithoutExtension()}() {\n  // Your code goes here...\n\n  return "Hello world!";\n}\n`);
            Scripts_1.default.loadedScripts.push(script);
            vscode_1.commands.executeCommand("integrationWorkbench.refreshScripts");
            vscode_1.commands.executeCommand("integrationWorkbench.openScript", script);
        });
    }
    ;
}
exports.default = CreateScriptCommand;
//# sourceMappingURL=CreateScriptCommand.js.map