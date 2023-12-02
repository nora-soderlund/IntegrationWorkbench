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
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const TypescriptScript_1 = __importDefault(require("../../entities/scripts/TypescriptScript"));
const Scripts_1 = __importDefault(require("../../Scripts"));
const GetRootPath_1 = __importDefault(require("../../utils/GetRootPath"));
const Command_1 = __importDefault(require("../Command"));
class EditScriptNameCommand extends Command_1.default {
    constructor(context) {
        super(context, 'integrationWorkbench.editScriptName');
    }
    handle(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            const rootPath = (0, GetRootPath_1.default)();
            if (!rootPath) {
                vscode_1.window.showErrorMessage("You must be in a workspace to create a script!");
                return;
            }
            const scriptsPath = Scripts_1.default.getScriptsPath(rootPath);
            vscode_1.window.showInputBox({
                prompt: "Enter a request name",
                value: reference.script.getName(),
                validateInput(value) {
                    if (!value.length) {
                        return "You must enter a script name or cancel.";
                    }
                    if (reference.script instanceof TypescriptScript_1.default) {
                        if (!value.endsWith('.ts')) {
                            return "Script name must end with '.ts' for TypeScript files!";
                        }
                    }
                    const nameValue = value.substring(0, value.length - 3);
                    if (/[^A-Za-z0-9_-]/.test(nameValue)) {
                        return "You must only enter a generic file name.";
                    }
                    if (value !== reference.script.getName()) {
                        if ((0, fs_1.existsSync)(path_1.default.join(scriptsPath, value))) {
                            return "There already exists a script with this name in this folder!";
                        }
                    }
                    return null;
                },
            }).then((value) => {
                if (!value) {
                    return;
                }
                reference.script.setName(value);
            });
        });
    }
}
exports.default = EditScriptNameCommand;
//# sourceMappingURL=EditScriptNameCommand.js.map