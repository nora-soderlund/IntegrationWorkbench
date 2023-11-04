"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const GetRootPath_1 = __importDefault(require("./GetRootPath"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
async function getWorkbenchStorageOption(context, name) {
    let workbenchStorage = vscode_1.workspace.getConfiguration("integrationWorkbench").get("defaultWorkbenchStorage");
    let workbenchStoragePath;
    if (!workbenchStorage || workbenchStorage === "prompt") {
        const options = [
            "Repository workbench (stored in the repository filesystem)",
            "User workbench (stored in the VS Code user storage)"
        ];
        const result = await vscode_1.window.showQuickPick(options, {
            canPickMany: false,
            placeHolder: "Select where the workbench files should be saved:"
        });
        if (!result) {
            return null;
        }
        switch (result) {
            case "Repository workbench (stored in the repository filesystem)": {
                workbenchStorage = "repository";
                break;
            }
            case "User workbench (stored in the VS Code user storage)": {
                workbenchStorage = "user";
                break;
            }
            default:
                throw new Error("Unexpected result from workbench storage option was given: " + result);
        }
    }
    if (workbenchStorage === "repository") {
        /*const result = await window.showOpenDialog({
          canSelectFiles: false,
          canSelectFolders: true,
          canSelectMany: false,
          openLabel: "Select",
          title: "Where do you want the workbench files to be saved?"
        });*/
        const rootPath = (0, GetRootPath_1.default)();
        if (!rootPath) {
            const result = await vscode_1.window.showSaveDialog({
                defaultUri: vscode_1.Uri.file(`/.workbench/${name.toLocaleLowerCase()}/`),
                saveLabel: "Select"
            });
            if (!result) {
                return null;
            }
            workbenchStoragePath = result;
        }
        else {
            workbenchStoragePath = vscode_1.Uri.file(rootPath);
        }
    }
    else if (workbenchStorage === "user") {
        workbenchStoragePath = context.globalStorageUri;
    }
    else {
        throw new Error("Invalid workbench storage option was given: " + workbenchStorage);
    }
    const workbenchesPath = path_1.default.join(workbenchStoragePath.fsPath, ".workbench/");
    try {
        if (!(0, fs_1.existsSync)(workbenchesPath)) {
            (0, fs_1.mkdirSync)(workbenchesPath, {
                recursive: true
            });
        }
    }
    catch (error) {
        vscode_1.window.showErrorMessage("VS Code may not have permissions to create files in the current workspace folder:\n\n" + error);
        return null;
    }
    return {
        location: workbenchStorage,
        path: workbenchesPath
    };
}
exports.default = getWorkbenchStorageOption;
//# sourceMappingURL=GetWorkbenchStorageOption.js.map