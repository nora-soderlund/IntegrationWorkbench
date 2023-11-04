"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function getRootPath() {
    if (vscode_1.workspace.workspaceFolders?.length) {
        return vscode_1.workspace.workspaceFolders[0].uri.fsPath;
    }
    return undefined;
}
exports.default = getRootPath;
;
//# sourceMappingURL=GetRootPath.js.map