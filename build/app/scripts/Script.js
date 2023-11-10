"use strict";
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
    constructor(filePath) {
        const parsedPath = path_1.default.parse(filePath);
        this.nameWithoutExtension = parsedPath.name;
        this.name = parsedPath.base;
        this.directory = parsedPath.dir;
        this.content = (0, fs_1.readFileSync)(filePath, {
            encoding: "utf-8"
        });
        if ((0, fs_1.existsSync)(path_1.default.join(this.directory, this.nameWithoutExtension + ".d.ts"))) {
            this.declaration = this.getDeclaration();
        }
    }
    setName(name) {
        var _a, _b;
        (0, fs_1.rmSync)(path_1.default.join(this.directory, this.name));
        this.name = name + ".ts";
        this.nameWithoutExtension = name;
        this.save();
        this.declaration = this.getDeclaration();
        if (this.scriptWebviewPanel) {
            this.scriptWebviewPanel.webviewPanel.title = this.name;
        }
        (_a = this.treeDataViewItem) === null || _a === void 0 ? void 0 : _a.update();
        (_b = this.treeDataViewItem) === null || _b === void 0 ? void 0 : _b.treeDataProvider.refresh();
    }
    save() {
        try {
            if (!(0, fs_1.existsSync)(this.directory)) {
                (0, fs_1.mkdirSync)(this.directory, {
                    recursive: true
                });
            }
        }
        catch (error) {
            vscode_1.window.showErrorMessage("VS Code may not have permissions to create files in the current workspace folder:\n\n" + error);
        }
        try {
            (0, fs_1.writeFileSync)(path_1.default.join(this.directory, this.name), this.content);
        }
        catch (error) {
            vscode_1.window.showErrorMessage(`Failed to save workbench '${this.name}':\n\n` + error);
        }
    }
    setContent(content) {
        this.content = content;
        const declarationFilePath = path_1.default.join(this.directory, this.nameWithoutExtension + ".d.ts");
        if ((0, fs_1.existsSync)(declarationFilePath)) {
            delete this.declaration;
            (0, fs_1.rmSync)(declarationFilePath);
        }
        this.save();
    }
    getDeclaration() {
        const compilerOptions = {
            declaration: true,
            allowJs: true,
        };
        const program = typescript_1.default.createProgram({
            rootNames: [this.name],
            options: compilerOptions,
        });
        let declaration = "";
        program.emit(undefined, (fileName, data) => {
            if (fileName.endsWith('.d.ts')) {
                declaration = data;
            }
        });
        return declaration;
    }
    getData() {
        return {
            name: this.name,
            content: this.content
        };
    }
    getDeclarationData() {
        if (!this.declaration) {
            this.declaration = this.getDeclaration();
            (0, fs_1.writeFileSync)(path_1.default.join(this.directory, this.nameWithoutExtension + ".d.ts"), this.declaration);
        }
        return {
            name: `ts:${this.nameWithoutExtension}.d.ts`,
            declaration: this.declaration
        };
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