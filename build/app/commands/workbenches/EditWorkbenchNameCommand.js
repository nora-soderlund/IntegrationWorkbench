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
const GetRootPath_1 = __importDefault(require("../../utils/GetRootPath"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const GetUniqueFolderPath_1 = __importDefault(require("../../utils/GetUniqueFolderPath"));
const GetCamelizedString_1 = __importDefault(require("../../utils/GetCamelizedString"));
class EditWorkbenchNameCommand {
    constructor(context) {
        this.context = context;
        context.subscriptions.push(vscode_1.commands.registerCommand('integrationWorkbench.editWorkbenchName', this.handle.bind(this)));
    }
    handle(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            let workbench;
            if (reference instanceof WorkbenchTreeItem_1.default) {
                workbench = reference.workbench;
            }
            else {
                throw new Error("Unknown entry point for editing workbench name.");
            }
            vscode_1.window.showInputBox({
                prompt: "Enter a workbench name",
                value: workbench.name,
                validateInput(value) {
                    if (!value.length) {
                        return "You must enter a collection name or cancel.";
                    }
                    return null;
                },
            }).then((name) => {
                if (!name) {
                    return;
                }
                const rootPath = (0, GetRootPath_1.default)();
                if (!rootPath) {
                    vscode_1.window.showErrorMessage("You must be in a workspace to create a workbench!");
                    return;
                }
                const workbenchesPath = path_1.default.join(rootPath, ".workbench/", "workbenches/");
                try {
                    if (!(0, fs_1.existsSync)(workbenchesPath)) {
                        (0, fs_1.mkdirSync)(workbenchesPath, {
                            recursive: true
                        });
                    }
                }
                catch (error) {
                    vscode_1.window.showErrorMessage("Failed to create workbenches folder: " + error);
                    return;
                }
                const uniqueWorkbenchPath = (0, GetUniqueFolderPath_1.default)(workbenchesPath, (0, GetCamelizedString_1.default)(name));
                if (!uniqueWorkbenchPath) {
                    vscode_1.window.showErrorMessage("There is too many workbenches with the same name in this storage option, please choose a different name.");
                    return null;
                }
                const currentPathDescription = path_1.default.basename(path_1.default.dirname(path_1.default.dirname(path_1.default.dirname(workbench.path))));
                workbench.delete();
                workbench.name = name;
                workbench.path = uniqueWorkbenchPath;
                if (workbench.description === currentPathDescription) {
                    workbench.description = path_1.default.basename(path_1.default.dirname(path_1.default.dirname(path_1.default.dirname(workbench.path))));
                }
                workbench.save();
                vscode_1.commands.executeCommand("integrationWorkbench.refreshWorkbenches");
            });
        });
    }
}
exports.default = EditWorkbenchNameCommand;
//# sourceMappingURL=EditWorkbenchNameCommand.js.map