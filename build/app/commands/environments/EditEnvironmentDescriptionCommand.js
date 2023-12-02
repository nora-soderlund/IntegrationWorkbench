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
const EnvironmentTreeItem_1 = __importDefault(require("../../views/trees/environments/items/EnvironmentTreeItem"));
class EditEnvironmentDescriptionCommand {
    constructor(context) {
        this.context = context;
        context.subscriptions.push(vscode_1.commands.registerCommand('integrationWorkbench.editEnvironmentDescription', this.handle.bind(this)));
    }
    handle(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            let environment;
            if (reference instanceof EnvironmentTreeItem_1.default) {
                environment = reference.environment;
            }
            else {
                throw new Error("Unknown entry point for editing environment description.");
            }
            vscode_1.window.showInputBox({
                prompt: "Enter a environment description",
                value: environment.data.description
            }).then((description) => {
                environment.data.description = description;
                environment.save();
                vscode_1.commands.executeCommand("integrationWorkbench.refreshEnvironments");
            });
        });
    }
}
exports.default = EditEnvironmentDescriptionCommand;
//# sourceMappingURL=EditEnvironmentDescriptionCommand.js.map