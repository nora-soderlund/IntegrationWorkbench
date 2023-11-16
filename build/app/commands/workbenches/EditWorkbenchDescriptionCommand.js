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
const WorkbenchTreeItem_1 = __importDefault(require("../../workbenches/trees/workbenches/items/WorkbenchTreeItem"));
class EditWorkbenchDescriptionCommand {
    constructor(context) {
        this.context = context;
        context.subscriptions.push(vscode_1.commands.registerCommand('integrationWorkbench.editWorkbenchDescription', this.handle.bind(this)));
    }
    handle(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            let workbench;
            if (reference instanceof WorkbenchTreeItem_1.default) {
                workbench = reference.workbench;
            }
            else {
                throw new Error("Unknown entry point for editing workbench description.");
            }
            vscode_1.window.showInputBox({
                prompt: "Enter a workbench description",
                value: workbench.description
            }).then((description) => {
                workbench.description = description;
                workbench.save();
                vscode_1.commands.executeCommand("integrationWorkbench.refreshWorkbenches");
            });
        });
    }
}
exports.default = EditWorkbenchDescriptionCommand;
//# sourceMappingURL=EditWorkbenchDescriptionCommand.js.map