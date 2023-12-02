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
const GetRootPath_1 = __importDefault(require("../../utils/GetRootPath"));
const GetUniqueFolderPath_1 = __importDefault(require("../../utils/GetUniqueFolderPath"));
const GetCamelizedString_1 = __importDefault(require("../../utils/GetCamelizedString"));
const EnvironmentTreeItem_1 = __importDefault(require("../../views/trees/environments/items/EnvironmentTreeItem"));
const Environments_1 = __importDefault(require("../../instances/Environments"));
class EditEnvironmentNameCommand {
    constructor(context) {
        this.context = context;
        context.subscriptions.push(vscode_1.commands.registerCommand('integrationWorkbench.editEnvironmentName', this.handle.bind(this)));
    }
    handle(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            let environment;
            if (reference instanceof EnvironmentTreeItem_1.default) {
                environment = reference.environment;
            }
            else {
                throw new Error("Unknown entry point for editing environment name.");
            }
            const rootPath = (0, GetRootPath_1.default)();
            if (!rootPath) {
                vscode_1.window.showErrorMessage("You must be in a workspace to edit an environment!");
                return;
            }
            const environmentsPath = Environments_1.default.getPath(rootPath);
            vscode_1.window.showInputBox({
                prompt: "Enter an environment name",
                value: environment.data.name,
                validateInput(value) {
                    if (!value.length) {
                        return "You must enter an environment name or cancel.";
                    }
                    return null;
                },
            }).then((name) => {
                if (!name) {
                    return;
                }
                const uniqueWorkbenchPath = (0, GetUniqueFolderPath_1.default)(environmentsPath, (0, GetCamelizedString_1.default)(name), ".json");
                if (!uniqueWorkbenchPath) {
                    vscode_1.window.showErrorMessage("There is too many environments with the same name in this storage option, please choose a different name.");
                    return null;
                }
                environment.delete();
                environment.data.name = name;
                environment.filePath = uniqueWorkbenchPath;
                environment.save();
                vscode_1.commands.executeCommand("integrationWorkbench.refreshEnvironments");
            });
        });
    }
}
exports.default = EditEnvironmentNameCommand;
//# sourceMappingURL=EditEnvironmentNameCommand.js.map