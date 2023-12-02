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
const path_1 = __importDefault(require("path"));
const Environment_1 = __importDefault(require("./entities/Environment"));
const fs_1 = require("fs");
const GetRootPath_1 = __importDefault(require("./utils/GetRootPath"));
const vscode_1 = require("vscode");
class Environments {
    static getPath(rootPath) {
        return path_1.default.join(rootPath, ".workbench/", "environments/");
    }
    static createFolder(rootPath) {
        const scriptsPath = this.getPath(rootPath);
        if (!(0, fs_1.existsSync)(scriptsPath)) {
            (0, fs_1.mkdirSync)(scriptsPath, {
                recursive: true
            });
        }
        return scriptsPath;
    }
    static createStatusBarItem(context) {
        this.statusBarItem.command = {
            command: "integrationWorkbench.selectEnvironment",
            title: "Select environment"
        };
        this.statusBarItem.show();
        const selectedEnvironmentName = context.workspaceState.get("selectedEnvironment");
        const selectedEnvironment = this.loadedEnvironments.find((environment) => environment.data.name === selectedEnvironmentName);
        if (selectedEnvironment) {
            this.selectEnvironment(context, selectedEnvironment);
        }
        else {
            this.selectEnvironment(context, null);
        }
    }
    static selectEnvironment(context, environment) {
        var _a;
        context.workspaceState.update("selectedEnvironment", (_a = environment === null || environment === void 0 ? void 0 : environment.data.name) !== null && _a !== void 0 ? _a : null);
        if (environment) {
            this.statusBarItem.text = `$(server-environment) ${environment.data.name}`;
        }
        else {
            this.statusBarItem.text = "$(server-environment) Select environment";
        }
        this.selectedEnvironment = environment;
    }
    static scan(sendRefreshCommand = true) {
        this.loadedEnvironments = [];
        const rootPath = (0, GetRootPath_1.default)();
        if (rootPath) {
            const folderPath = this.getPath(rootPath);
            if (!(0, fs_1.existsSync)(folderPath)) {
                return;
            }
            const files = (0, fs_1.readdirSync)(folderPath);
            for (let file of files) {
                if (file.endsWith(".json")) {
                    const filePath = path_1.default.join(folderPath, file);
                    this.loadedEnvironments.push(new Environment_1.default(filePath));
                }
            }
        }
        if (sendRefreshCommand) {
            vscode_1.commands.executeCommand(`integrationWorkbench.refreshEnvironments`);
        }
        return this.loadedEnvironments;
    }
    static getEnvironmentInjection(environment) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!environment) {
                if (!this.selectedEnvironment) {
                    return "";
                }
                environment = this.selectedEnvironment;
            }
            const parsedVariables = yield environment.getParsedVariables(new AbortController());
            return `const process = { env: { ${parsedVariables.map((parsedVariable) => `${parsedVariable.key}: ${JSON.stringify(parsedVariable.value)}`).join(', ')} } };`;
        });
    }
    static getEnvironmentDeclaration(environment) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!environment) {
                if (!this.selectedEnvironment) {
                    return "";
                }
                environment = this.selectedEnvironment;
            }
            const parsedVariables = environment.getVariables();
            return `declare const process: { env: { ${environment.getVariables().map((key) => `${key}: any;`).join(' ')} }; };`;
        });
    }
}
Environments.loadedEnvironments = [];
Environments.statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 0);
exports.default = Environments;
//# sourceMappingURL=Environments.js.map