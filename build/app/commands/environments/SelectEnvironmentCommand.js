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
const Environments_1 = __importDefault(require("../../instances/Environments"));
class SelectEnvironmentCommand {
    constructor(context) {
        this.context = context;
        context.subscriptions.push(vscode_1.commands.registerCommand('integrationWorkbench.selectEnvironment', this.handle.bind(this)));
    }
    handle() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Environments_1.default.loadedEnvironments.length) {
                vscode_1.window.showInformationMessage("There's no environments, create an environment to get started.", "Create an Environment").then((selection) => {
                    if (selection) {
                        vscode_1.commands.executeCommand("integrationWorkbench.createEnvironment");
                    }
                });
                return;
            }
            const selection = yield vscode_1.window.showQuickPick(["None"].concat(Environments_1.default.loadedEnvironments.map((environment) => environment.data.name)), {
                canPickMany: false,
                title: "Select environment to use:",
            });
            if (!selection) {
                return;
            }
            if (selection === "None") {
                Environments_1.default.selectEnvironment(this.context, null);
            }
            else {
                const selectedEnvironment = Environments_1.default.loadedEnvironments.find((environment) => environment.data.name === selection);
                if (selectedEnvironment) {
                    Environments_1.default.selectEnvironment(this.context, selectedEnvironment);
                }
            }
        });
    }
}
exports.default = SelectEnvironmentCommand;
//# sourceMappingURL=SelectEnvironmentCommand.js.map