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
const WorkbenchCollection_1 = require("../../workbenches/collections/WorkbenchCollection");
const crypto_1 = require("crypto");
class CreateCollectionCommand {
    constructor(context) {
        this.context = context;
        context.subscriptions.push(vscode_1.commands.registerCommand('integrationWorkbench.createCollection', this.handle.bind(this)));
    }
    handle(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            vscode_1.window.showInformationMessage('Create collection');
            vscode_1.window.showInputBox({
                prompt: "Enter a collection name",
                validateInput(value) {
                    if (!value.length) {
                        return "You must enter a collection name or cancel.";
                    }
                    return null;
                },
            }).then((value) => {
                if (!value) {
                    return;
                }
                if (reference instanceof WorkbenchTreeItem_1.default) {
                    reference.workbench.collections.push(new WorkbenchCollection_1.WorkbenchCollection(reference.workbench, (0, crypto_1.randomUUID)(), value, undefined, []));
                    reference.workbench.save();
                    vscode_1.commands.executeCommand("integrationWorkbench.refreshWorkbenches");
                }
            });
        });
    }
}
exports.default = CreateCollectionCommand;
//# sourceMappingURL=CreateCollectionCommand.js.map