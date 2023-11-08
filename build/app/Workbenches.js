"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanForWorkbenches = exports.workbenches = void 0;
const vscode_1 = require("vscode");
const Workbench_1 = require("./workbenches/Workbench");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const GetRootPath_1 = __importDefault(require("./utils/GetRootPath"));
exports.workbenches = [];
function scanForWorkbenches(context, refresh = true) {
    const folders = [];
    const rootPaths = [
        context.globalStorageUri.fsPath,
        (0, GetRootPath_1.default)()
    ];
    for (let rootPath of rootPaths) {
        if (!rootPath) {
            continue;
        }
        if (!(0, fs_1.existsSync)(path_1.default.join(rootPath, ".workbench", "workbenches"))) {
            continue;
        }
        const files = (0, fs_1.readdirSync)(path_1.default.join(rootPath, ".workbench", "workbenches"));
        for (let file of files) {
            if ((0, fs_1.existsSync)(path_1.default.join(rootPath, ".workbench", "workbenches", file, "workbench.json"))) {
                folders.push(path_1.default.join(rootPath, ".workbench", "workbenches", file));
            }
        }
    }
    exports.workbenches.length = 0;
    exports.workbenches.push(...folders.map((folder) => {
        const content = (0, fs_1.readFileSync)(path_1.default.join(folder, "workbench.json"), {
            encoding: "utf-8"
        });
        const input = JSON.parse(content);
        return new Workbench_1.Workbench(input, folder);
    }));
    if (refresh) {
        vscode_1.commands.executeCommand(`integrationWorkbench.refreshWorkbenches`);
    }
    return exports.workbenches;
}
exports.scanForWorkbenches = scanForWorkbenches;
;
//# sourceMappingURL=Workbenches.js.map