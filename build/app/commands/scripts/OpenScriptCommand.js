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
const Command_1 = __importDefault(require("../Command"));
class OpenScriptCommand extends Command_1.default {
    constructor(context) {
        super(context, 'integrationWorkbench.openScript');
    }
    handle(script) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = vscode_1.Uri.file(script.filePath);
            const textDocument = yield vscode_1.workspace.openTextDocument(file);
            vscode_1.window.showTextDocument(textDocument);
        });
    }
    ;
}
exports.default = OpenScriptCommand;
//# sourceMappingURL=OpenScriptCommand.js.map