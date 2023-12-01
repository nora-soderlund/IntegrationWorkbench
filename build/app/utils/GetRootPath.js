"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function getRootPath() {
    var _a;
    if ((_a = vscode_1.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a.length) {
        return vscode_1.workspace.workspaceFolders[0].uri.fsPath;
    }
    return undefined;
}
exports.default = getRootPath;
;
//# sourceMappingURL=GetRootPath.js.map