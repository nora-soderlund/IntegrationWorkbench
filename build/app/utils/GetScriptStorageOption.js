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
const GetRootPath_1 = __importDefault(require("./GetRootPath"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function getScriptStorageOption(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let workbenchStorage = vscode_1.workspace.getConfiguration("integrationWorkbench").get("defaultWorkbenchStorage");
        let workbenchStoragePath;
        if (!workbenchStorage || workbenchStorage === "prompt") {
            const options = [
                "Repository script (stored in the repository filesystem)",
                "User script - cannot be used in repository workbenches (stored in the VS Code user storage)"
            ];
            const result = yield vscode_1.window.showQuickPick(options, {
                canPickMany: false,
                placeHolder: "Select where the script files should be saved:"
            });
            console.log("Result:", result);
            if (!result) {
                return null;
            }
            console.log("Result2:", result);
            switch (result) {
                case "Repository script (stored in the repository filesystem)": {
                    workbenchStorage = "repository";
                    break;
                }
                case "User script - cannot be used in repository workbenches (stored in the VS Code user storage)": {
                    workbenchStorage = "user";
                    break;
                }
                default:
                    throw new Error("Unexpected result from script storage option was given: " + result);
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
                const result = yield vscode_1.window.showSaveDialog({
                    defaultUri: vscode_1.Uri.file(path_1.default.join(`/.workbench/scripts/`)),
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
            throw new Error("Invalid script storage option was given: " + workbenchStorage);
        }
        const workbenchesPath = path_1.default.join(workbenchStoragePath.fsPath, ".workbench/", "scripts/");
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
    });
}
exports.default = getScriptStorageOption;
//# sourceMappingURL=GetScriptStorageOption.js.map