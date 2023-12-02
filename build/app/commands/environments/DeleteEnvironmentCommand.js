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
const Environments_1 = __importDefault(require("../../Environments"));
class DeleteEnvironmentCommand {
    constructor(context) {
        this.context = context;
        context.subscriptions.push(vscode_1.commands.registerCommand('integrationWorkbench.deleteEnvironment', this.handle.bind(this)));
    }
    handle(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            let environment;
            if (reference instanceof EnvironmentTreeItem_1.default) {
                environment = reference.environment;
            }
            else {
                throw new Error("Unknown entry point for deleting environment.");
            }
            environment.delete();
            Environments_1.default.scan();
        });
    }
}
exports.default = DeleteEnvironmentCommand;
//# sourceMappingURL=DeleteEnvironmentCommand.js.map