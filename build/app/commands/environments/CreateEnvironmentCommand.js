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
const GetUniqueFolderPath_1 = __importDefault(require("../../utils/GetUniqueFolderPath"));
const GetCamelizedString_1 = __importDefault(require("../../utils/GetCamelizedString"));
const GetRootPath_1 = __importDefault(require("../../utils/GetRootPath"));
const fs_1 = require("fs");
const Environments_1 = __importDefault(require("../../instances/Environments"));
const Environment_1 = __importDefault(require("../../entities/environments/Environment"));
class CreateEnvironmentCommand {
    constructor(context) {
        this.context = context;
        context.subscriptions.push(vscode_1.commands.registerCommand('integrationWorkbench.createEnvironment', this.handle.bind(this)));
    }
    handle() {
        return __awaiter(this, void 0, void 0, function* () {
            const name = yield vscode_1.window.showInputBox({
                placeHolder: "Enter the name of this environment:",
                validateInput(value) {
                    if (!value.length) {
                        return "You must enter a name for this environment!";
                    }
                    return null;
                },
            });
            if (!name) {
                return;
            }
            const rootPath = (0, GetRootPath_1.default)();
            if (!rootPath) {
                vscode_1.window.showErrorMessage("You must be in a workspace to create an environment!");
                return;
            }
            Environments_1.default.createFolder(rootPath);
            const environmentsPath = Environments_1.default.getPath(rootPath);
            const uniqueEnvironmentPath = (0, GetUniqueFolderPath_1.default)(environmentsPath, (0, GetCamelizedString_1.default)(name), ".json");
            if (!uniqueEnvironmentPath) {
                vscode_1.window.showErrorMessage("There is too many environments with the same name in this storage option, please choose a different name.");
                return null;
            }
            const environmentData = {
                name,
                variables: [],
                variablesAutoRefresh: false
            };
            (0, fs_1.writeFileSync)(uniqueEnvironmentPath, JSON.stringify(environmentData, undefined, 2));
            const environment = new Environment_1.default(uniqueEnvironmentPath);
            Environments_1.default.loadedEnvironments.push(environment);
            vscode_1.commands.executeCommand("integrationWorkbench.refreshEnvironments");
        });
    }
    ;
}
exports.default = CreateEnvironmentCommand;
//# sourceMappingURL=CreateEnvironmentCommand.js.map