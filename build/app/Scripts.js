"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const GetRootPath_1 = __importDefault(require("./utils/GetRootPath"));
const Script_1 = __importDefault(require("./scripts/Script"));
const child_process_1 = require("child_process");
class Scripts {
    static scanForScripts(context, sendRefreshScriptsCommand = true) {
        this.loadedScripts = [];
        const rootPath = (0, GetRootPath_1.default)();
        if (rootPath) {
            const folderPath = path_1.default.join(rootPath, ".workbench", "scripts");
            if (!(0, fs_1.existsSync)(folderPath)) {
                return;
            }
            const files = (0, fs_1.readdirSync)(folderPath);
            for (let file of files) {
                if (file.endsWith(".json")) {
                    const dataPath = path_1.default.join(folderPath, file);
                    const data = JSON.parse((0, fs_1.readFileSync)(dataPath, {
                        encoding: "utf-8"
                    }));
                    const script = new Script_1.default(rootPath, data);
                    switch (data.type) {
                        case "typescript": {
                            const typescriptPath = path_1.default.join(folderPath, script.data.name + '.ts');
                            if ((0, fs_1.existsSync)(typescriptPath)) {
                                script.typescript = (0, fs_1.readFileSync)(typescriptPath, {
                                    encoding: "utf-8"
                                });
                            }
                            const javascriptPath = path_1.default.join(folderPath, 'build', script.data.name + '.js');
                            if ((0, fs_1.existsSync)(javascriptPath)) {
                                script.javascript = (0, fs_1.readFileSync)(javascriptPath, {
                                    encoding: "utf-8"
                                });
                            }
                            const declarationPath = path_1.default.join(folderPath, 'build', script.data.name + '.d.ts');
                            if ((0, fs_1.existsSync)(declarationPath)) {
                                script.declaration = (0, fs_1.readFileSync)(declarationPath, {
                                    encoding: "utf-8"
                                });
                            }
                            break;
                        }
                    }
                    this.loadedScripts.push(script);
                }
            }
        }
        if (sendRefreshScriptsCommand) {
            vscode_1.commands.executeCommand(`integrationWorkbench.refreshScripts`);
        }
        return this.loadedScripts;
    }
    static generateScriptDependencyDeclaration(rootPath, dependency) {
        return new Promise((resolve) => {
            const scriptNodeModulesPath = path_1.default.join(rootPath, ".workbench", "scripts", "node_modules");
            if (!(0, fs_1.existsSync)(scriptNodeModulesPath)) {
                (0, fs_1.mkdirSync)(scriptNodeModulesPath, {
                    recursive: true
                });
            }
            let declaration;
            let dependencyDeclarationPath;
            if (dependency.includes('/')) {
                const [directory, dependencyName] = dependency.split('/');
                const dependencyPath = path_1.default.join(scriptNodeModulesPath, directory);
                if (!(0, fs_1.existsSync)(dependencyPath)) {
                    (0, fs_1.mkdirSync)(dependencyPath);
                }
                dependencyDeclarationPath = path_1.default.join(dependencyPath, `${dependencyName}.d.ts`);
                declaration = (0, child_process_1.execSync)(`npx dts-gen -m ${dependency} -s`, {
                    cwd: rootPath,
                    encoding: "utf-8"
                });
            }
            else {
                dependencyDeclarationPath = path_1.default.join(scriptNodeModulesPath, `${dependency}.d.ts`);
                declaration = (0, child_process_1.execSync)(`npx dts-gen -m ${dependency} -f ${dependencyDeclarationPath} --overwrite`, {
                    cwd: rootPath,
                    encoding: "utf-8"
                });
            }
            const index = this.loadedDependencies.findIndex((loadedDependency) => loadedDependency.name === dependency);
            if (index !== -1) {
                this.loadedDependencies.splice(index, 1);
            }
            declaration = declaration.replace(/export/g, 'declare');
            (0, fs_1.writeFileSync)(dependencyDeclarationPath, declaration);
            this.loadedDependencies.push({
                name: dependency,
                declaration
            });
            resolve();
        });
    }
    static generateScriptDependencyDeclarations() {
        const rootPath = (0, GetRootPath_1.default)();
        if (!rootPath) {
            return;
        }
        const scriptNodeModulesPath = path_1.default.join(rootPath, ".workbench", "scripts", "node_modules");
        if ((0, fs_1.existsSync)(scriptNodeModulesPath)) {
            (0, fs_1.rmdirSync)(scriptNodeModulesPath, {
                recursive: true
            });
        }
        (0, fs_1.mkdirSync)(scriptNodeModulesPath, {
            recursive: true
        });
        this.loadedDependencies = [];
        const dependencies = [...new Set(this.loadedScripts.flatMap((script) => script.data.dependencies))];
        for (let dependency of dependencies) {
            this.generateScriptDependencyDeclaration(rootPath, dependency);
        }
    }
}
Scripts.loadedScripts = [];
Scripts.loadedDependencies = [];
exports.default = Scripts;
//# sourceMappingURL=Scripts.js.map