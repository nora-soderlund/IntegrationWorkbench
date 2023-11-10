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
const GetScriptStorageOption_1 = __importDefault(require("../../utils/GetScriptStorageOption"));
const fs_1 = require("fs");
const Script_1 = __importDefault(require("../../scripts/Script"));
const Scripts_1 = __importDefault(require("../../Scripts"));
class CreateScriptCommand {
    constructor(context) {
        this.context = context;
        context.subscriptions.push(vscode_1.commands.registerCommand('integrationWorkbench.createScript', this.handle.bind(this)));
    }
    handle() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageOption = yield (0, GetScriptStorageOption_1.default)(this.context);
            if (!storageOption) {
                return;
            }
            const name = yield vscode_1.window.showInputBox({
                placeHolder: "Enter the name of this script:",
                validateInput(value) {
                    if (!value.length) {
                        return "You must enter a name for this script!";
                    }
                    if ((0, fs_1.existsSync)(path_1.default.join(storageOption.path, value))) {
                        return "There already exists a script with this name in this folder!";
                    }
                    return null;
                },
            });
            if (!name) {
                return;
            }
            const script = new Script_1.default(path_1.default.join(storageOption.path, name + ".js"));
            script.save(`
      function getCurrentDate() {
        return new Date().toISOString();
      }
    `);
            Scripts_1.default.loadedScripts.push(script);
            vscode_1.commands.executeCommand("integrationWorkbench.refreshScripts");
        });
    }
    ;
}
exports.default = CreateScriptCommand;
//# sourceMappingURL=CreateScriptCommand.js.map