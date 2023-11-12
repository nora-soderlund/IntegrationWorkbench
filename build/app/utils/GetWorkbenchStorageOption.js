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
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function getWorkbenchStorageOption(rootPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let workbenchStoragePath = vscode_1.Uri.file(rootPath);
        const workbenchesPath = path_1.default.join(workbenchStoragePath.fsPath, ".workbench/", "workbenches/");
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
        return workbenchesPath;
    });
}
exports.default = getWorkbenchStorageOption;
//# sourceMappingURL=GetWorkbenchStorageOption.js.map