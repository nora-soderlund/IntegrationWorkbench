"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function getUniqueFolderPath(rootPath, folderName, extension) {
    let currentPath = path_1.default.join(rootPath, folderName);
    if (extension) {
        currentPath += extension;
    }
    if (!(0, fs_1.existsSync)(currentPath)) {
        return currentPath;
    }
    for (let index = 1; index < 20; index++) {
        currentPath = path_1.default.join(rootPath, folderName + "-" + index);
        if (extension) {
            currentPath += extension;
        }
        if (!(0, fs_1.existsSync)(currentPath)) {
            return currentPath;
        }
    }
    return null;
}
exports.default = getUniqueFolderPath;
//# sourceMappingURL=GetUniqueFolderPath.js.map