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
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class EditScriptNameCommand {
    constructor(context) {
        this.context = context;
        context.subscriptions.push(vscode_1.commands.registerCommand('integrationWorkbench.editScriptName', this.handle.bind(this)));
    }
    handle(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            vscode_1.window.showInputBox({
                prompt: "Enter a request name",
                value: reference.script.nameWithoutExtension,
                validateInput(value) {
                    if (!value.length) {
                        return "You must enter a script name or cancel.";
                    }
                    if (/[^A-Za-z0-9_-]/.test(value)) {
                        return "You must only enter a generic file name.";
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