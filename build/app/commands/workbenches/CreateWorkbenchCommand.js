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
const GetWorkbenchStorageOption_1 = __importDefault(require("../../utils/GetWorkbenchStorageOption"));
const GetUniqueFolderPath_1 = __importDefault(require("../../utils/GetUniqueFolderPath"));
const GetCamelizedString_1 = __importDefault(require("../../utils/GetCamelizedString"));
const GetRootPath_1 = __importDefault(require("../../utils/GetRootPath"));
const Workbench_1 = require("../../workbenches/Workbench");
const path_1 = __importDefault(require("path"));
const Workbenches_1 = require("../../Workbenches");
const crypto_1 = require("crypto");
class CreateWorkbenchCommand {
    constructor(context) {
        this.context = context;
        context.subscriptions.push(vscode_1.commands.registerCommand('integrationWorkbench.createWorkbench', this.handle.bind(this)));
    }
    handle() {
        return __awaiter(this, void 0, void 0, function* () {
            vscode_1.window.showInformationMessage('Create workbench');
            const name = yield vscode_1.window.showInputBox({
                placeHolder: "Enter the name of this workbench:",
                validateInput(value) {
                    if (!value.length) {
                        return "You must enter a name for this workbench!";
                    }
                    return null;
                },
            });
            if (!name) {
                return;
            }
            const storageOption = yield (0, GetWorkbenchStorageOption_1.default)(this.context, name);
            if (!storageOption) {
                return;
            }
            const uniqueWorkbenchPath = (0, GetUniqueFolderPath_1.default)(storageOption.path, (0, GetCamelizedString_1.default)(name));
            if (!uniqueWorkbenchPath) {
                vscode_1.window.showErrorMessage("There is too many workbenches with the same name in this storage option, please choose a different name.");
                return null;
            }
            const rootPath = (0, GetRootPath_1.default)();
            const workbench = new Workbench_1.Workbench({
                id: (0, crypto_1.randomUUID)(),
                name,
                storage: {
                    location: storageOption.location,
                    base: (rootPath) ? (path_1.default.basename(rootPath)) : (undefined)
                },
                requests: [],
                collections: []
            }, uniqueWorkbenchPath);
            workbench.save();
            Workbenches_1.workbenches.push(workbench);
            vscode_1.commands.executeCommand("integrationWorkbench.refreshWorkbenches");
        });
    }
    ;
}
exports.default = CreateWorkbenchCommand;
//# sourceMappingURL=CreateWorkbenchCommand.js.map