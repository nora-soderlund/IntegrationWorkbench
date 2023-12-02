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
const ScriptTreeItem_1 = __importDefault(require("../../views/trees/scripts/items/ScriptTreeItem"));
const Scripts_1 = __importDefault(require("../../Scripts"));
const Command_1 = __importDefault(require("../Command"));
class DeleteScriptCommand extends Command_1.default {
    constructor(context) {
        super(context, 'integrationWorkbench.deleteScript');
    }
    handle(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            let script;
            if (reference instanceof ScriptTreeItem_1.default) {
                script = reference.script;
            }
            else {
                throw new Error("Unknown entry point for deleting script.");
            }
            script.deleteScript();
            const index = Scripts_1.default.loadedScripts.indexOf(script);
            if (index !== -1) {
                Scripts_1.default.loadedScripts.splice(index, 1);
            }
            vscode_1.commands.executeCommand("integrationWorkbench.refreshScripts");
        });
    }
}
exports.default = DeleteScriptCommand;
//# sourceMappingURL=DeleteScriptCommand.js.map