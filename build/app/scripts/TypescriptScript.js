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
class TypescriptScript {
    constructor(filePath) {
        this.filePath = filePath;
    }
    getName() {
        return path_1.default.basename(this.filePath);
    }
    getNameWithoutExtension() {
        const name = this.getName();
        return name.substring(0, name.length - path_1.default.extname(name).length);
    }
    setName(name) {
        const script = this.getScript();
        this.deleteScript();
        this.filePath = path_1.default.join(path_1.default.dirname(this.filePath), name);
        this.saveScript(script);
        if (this.treeDataViewItem) {
            this.treeDataViewItem.update();
            this.treeDataViewItem.treeDataProvider.refresh();
        }
    }
    deleteScript() {
        (0, fs_1.rmSync)(this.filePath);
    }
    getScript() {
        return (0, fs_1.readFileSync)(this.filePath, {
            encoding: "utf-8"
        });
    }
    saveScript(script) {
        try {
            (0, fs_1.writeFileSync)(this.filePath, script, {
                encoding: "utf-8"
            });
        }
        catch (error) {
            vscode_1.window.showErrorMessage(`Failed to save script:\n\n` + error);
        }
    }
    build() {
        const compilerOptions = {
            declaration: true,
            allowJs: true,
            module: typescript_1.default.ModuleKind.CommonJS
        };
        typescript_1.default.createSourceFile(this.filePath, this.getScript(), typescript_1.default.ScriptTarget.Latest, true, typescript_1.default.ScriptKind.TS);
        const program = typescript_1.default.createProgram({
            rootNames: [this.filePath],
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
                    console.log("nice", { declaration, javascript });
                    resolve({
                        declaration,
                        javascript
                    });
                }
            });
            const diagnostics = typescript_1.default.getPreEmitDiagnostics(program).concat(result.diagnostics);
            if (diagnostics.length > 0) {
                const error = typescript_1.default.formatDiagnosticsWithColorAndContext(diagnostics, {
                    getCanonicalFileName: fileName => fileName,
                    getCurrentDirectory: () => process.cwd(),
                    getNewLine: () => typescript_1.default.sys.newLine,
                });
                console.error("Failed to build files:", error);
                reject(error);
            }
            else {
                console.log('Build files generated successfully.');
            }
        });
    }
    getDeclarationData() {
        return __awaiter(this, void 0, void 0, function* () {
            const build = yield this.build();
            return {
                name: `ts:${this.getNameWithoutExtension()}.d.ts`,
                declaration: build.declaration
            };
        });
    }
}
exports.default = TypescriptScript;
//# sourceMappingURL=TypescriptScript.js.map