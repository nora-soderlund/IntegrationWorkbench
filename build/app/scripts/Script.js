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
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const vscode_1 = require("vscode");
const typescript_1 = __importDefault(require("typescript"));
const ScriptWebviewPanel_1 = require("../panels/ScriptWebviewPanel");
class Script {
    constructor(rootPath, data) {
        this.rootPath = rootPath;
        this.data = data;
    }
    getDataPath() {
        return path_1.default.join(this.rootPath, ".workbench", "scripts", `${this.data.name}.json`);
    }
    getTypeScriptPath() {
        return path_1.default.join(this.rootPath, ".workbench", "scripts", `${this.data.name}.ts`);
    }
    getJavaScriptPath() {
        return path_1.default.join(this.rootPath, ".workbench", "scripts", 'build', `${this.data.name}.js`);
    }
    getDeclarationPath() {
        return path_1.default.join(this.rootPath, ".workbench", "scripts", 'build', `${this.data.name}.d.ts`);
    }
    setName(name) {
        this.delete();
        this.deleteBuild();
        this.data.name = name;
        this.save();
        this.createBuild();
        if (this.scriptWebviewPanel) {
            this.scriptWebviewPanel.webviewPanel.title = this.data.name;
        }
        if (this.treeDataViewItem) {
            this.treeDataViewItem.update();
            this.treeDataViewItem.treeDataProvider.refresh();
        }
    }
    delete() {
        const dataPath = this.getDataPath();
        const scriptPath = this.getTypeScriptPath();
        const javascriptPath = this.getJavaScriptPath();
        const declarationPath = this.getDeclarationPath();
        (0, fs_1.rmSync)(dataPath);
        (0, fs_1.rmSync)(scriptPath);
        (0, fs_1.rmSync)(declarationPath);
        (0, fs_1.rmSync)(javascriptPath);
        this.disposeWebviewPanel();
        this.deleteWebviewPanel();
    }
    save() {
        var _a;
        const dataPath = this.getDataPath();
        try {
            const directoryPath = path_1.default.dirname(dataPath);
            if (!(0, fs_1.existsSync)(directoryPath)) {
                (0, fs_1.mkdirSync)(directoryPath, {
                    recursive: true
                });
            }
        }
        catch (error) {
            vscode_1.window.showErrorMessage("VS Code may not have permissions to create files in the current workspace folder:\n\n" + error);
        }
        try {
            const typeScriptPath = this.getTypeScriptPath();
            (0, fs_1.writeFileSync)(dataPath, JSON.stringify(this.getData(), undefined, 2));
            (0, fs_1.writeFileSync)(typeScriptPath, (_a = this.typescript) !== null && _a !== void 0 ? _a : "");
        }
        catch (error) {
            vscode_1.window.showErrorMessage(`Failed to save script '${this.data.name}':\n\n` + error);
        }
    }
    setContent(content) {
        this.typescript = content;
        this.deleteBuild();
        this.save();
    }
    deleteBuild() {
        delete this.declaration;
        const declarationFilePath = this.getDeclarationPath();
        if ((0, fs_1.existsSync)(declarationFilePath)) {
            (0, fs_1.rmSync)(declarationFilePath);
        }
        const scriptPath = this.getTypeScriptPath();
        if ((0, fs_1.existsSync)(scriptPath)) {
            (0, fs_1.rmSync)(scriptPath);
        }
    }
    createBuild() {
        return __awaiter(this, void 0, void 0, function* () {
            this.createBuildDirectory();
            const { declaration, javascript } = yield this.build();
            const buildPath = this.getJavaScriptPath();
            const declarationPath = this.getDeclarationPath();
            (0, fs_1.writeFileSync)(buildPath, javascript);
            (0, fs_1.writeFileSync)(declarationPath, declaration);
            this.declaration = declaration;
            this.javascript = javascript;
        });
    }
    createBuildDirectory() {
        const buildPath = this.getJavaScriptPath();
        const buildDirectory = path_1.default.dirname(buildPath);
        if (!(0, fs_1.existsSync)(buildDirectory)) {
            (0, fs_1.mkdirSync)(buildDirectory, {
                recursive: true
            });
        }
    }
    build() {
        var _a;
        const compilerOptions = {
            declaration: true,
            allowJs: true,
            module: typescript_1.default.ModuleKind.ESNext
        };
        const typescriptPath = this.getTypeScriptPath();
        typescript_1.default.createSourceFile(typescriptPath, (_a = this.typescript) !== null && _a !== void 0 ? _a : "", typescript_1.default.ScriptTarget.Latest, true, typescript_1.default.ScriptKind.TS);
        const program = typescript_1.default.createProgram({
            rootNames: [typescriptPath],
            options: compilerOptions,
        });
        return new Promise((resolve, reject) => {
            let declaration, javascript;
            const result = program.emit(undefined, (fileName, data) => {
                if (fileName.endsWith('.d.ts')) {
                    declaration = data;
                }
                else if (fileName.endsWith('.js')) {
                    javascript = data;
                }
                if (declaration && javascript) {
                    resolve({
                        declaration,
                        javascript
                    });
                }
            });
            const diagnostics = typescript_1.default.getPreEmitDiagnostics(program).concat(result.diagnostics);
            if (diagnostics.length > 0) {
                console.error(typescript_1.default.formatDiagnosticsWithColorAndContext(diagnostics, {
                    getCanonicalFileName: fileName => fileName,
                    getCurrentDirectory: () => process.cwd(),
                    getNewLine: () => typescript_1.default.sys.newLine,
                }));
                reject();
            }
            else {
                console.log('Build files generated successfully.');
            }
        });
    }
    getData() {
        return {
            name: this.data.name,
            description: this.data.description,
            type: this.data.type,
            dependencies: this.data.dependencies
        };
    }
    getContentData() {
        var _a;
        return Object.assign(Object.assign({}, this.getData()), { typescript: (_a = this.typescript) !== null && _a !== void 0 ? _a : "" });
    }
    getDeclarationData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.declaration || !this.javascript) {
                yield this.createBuild();
            }
            if (!this.declaration || !this.javascript) {
                return null;
            }
            return {
                name: `ts:${this.data.name}.d.ts`,
                declaration: this.declaration
            };
        });
    }
    showWebviewPanel(context) {
        var _a;
        if (!this.scriptWebviewPanel) {
            this.scriptWebviewPanel = new ScriptWebviewPanel_1.ScriptWebviewPanel(context, this);
            if (((_a = this.treeDataViewItem) === null || _a === void 0 ? void 0 : _a.iconPath) instanceof vscode_1.Uri) {
                this.setWebviewPanelIcon(this.treeDataViewItem.iconPath);
            }
        }
        else {
            this.scriptWebviewPanel.reveal();
        }
        //commands.executeCommand("integrationWorkbench.openResponse", this);
    }
    setWebviewPanelIcon(icon) {
        if (this.scriptWebviewPanel) {
            this.scriptWebviewPanel.webviewPanel.iconPath = icon;
        }
    }
    deleteWebviewPanel() {
        delete this.scriptWebviewPanel;
    }
    disposeWebviewPanel() {
        var _a;
        (_a = this.scriptWebviewPanel) === null || _a === void 0 ? void 0 : _a.dispose();
    }
}
exports.default = Script;
//# sourceMappingURL=Script.js.map