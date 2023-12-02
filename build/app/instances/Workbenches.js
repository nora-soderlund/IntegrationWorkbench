"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanForWorkbenches = exports.getAllRequestsWithWebviews = exports.workbenches = void 0;
const vscode_1 = require("vscode");
const Workbench_1 = require("../entities/workbenches/Workbench");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const GetRootPath_1 = __importDefault(require("../utils/GetRootPath"));
exports.workbenches = [];
function getAllRequestsWithWebviews() {
    const requestsWithWebviews = [];
    exports.workbenches.forEach((workbench) => {
        const requests = workbench.collections.flatMap((collection) => collection.requests).concat(workbench.requests);
        requests.forEach((request) => {
            if (request.requestWebviewPanel) {
                requestsWithWebviews.push(request);
            }
        });
    });
    return requestsWithWebviews;
}
exports.getAllRequestsWithWebviews = getAllRequestsWithWebviews;
function scanForWorkbenches(context, refresh = true) {
    exports.workbenches.length = 0;
    const rootPath = (0, GetRootPath_1.default)();
    if (rootPath && (0, fs_1.existsSync)(path_1.default.join(rootPath, ".workbench", "workbenches"))) {
        const files = (0, fs_1.readdirSync)(path_1.default.join(rootPath, ".workbench", "workbenches"));
        for (let file of files) {
            if ((0, fs_1.existsSync)(path_1.default.join(rootPath, ".workbench", "workbenches", file, "workbench.json"))) {
                const folder = path_1.default.join(rootPath, ".workbench", "workbenches", file);
                const content = (0, fs_1.readFileSync)(path_1.default.join(folder, "workbench.json"), {
                    encoding: "utf-8"
                });
                const input = JSON.parse(content);
                exports.workbenches.push(new Workbench_1.Workbench(input, folder));
            }
        }
    }
    if (refresh) {
        vscode_1.commands.executeCommand(`integrationWorkbench.refreshWorkbenches`);
    }
    return exports.workbenches;
}
exports.scanForWorkbenches = scanForWorkbenches;
;
//# sourceMappingURL=Workbenches.js.map