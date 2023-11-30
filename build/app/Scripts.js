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
const vscode_1 = require("vscode");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const GetRootPath_1 = __importDefault(require("./utils/GetRootPath"));
const TypescriptScript_1 = __importDefault(require("./scripts/TypescriptScript"));
const typescript_1 = require("typescript");
const esbuild_1 = __importDefault(require("esbuild"));
class Scripts {
    static getScriptsPath(rootPath) {
        return path_1.default.join(rootPath, ".workbench/", "scripts/");
    }
    static createScriptsFolder(rootPath) {
        const scriptsPath = this.getScriptsPath(rootPath);
        if (!(0, fs_1.existsSync)(scriptsPath)) {
            (0, fs_1.mkdirSync)(scriptsPath, {
                recursive: true
            });
        }
        return scriptsPath;
    }
    ;
    static scanForScripts(sendRefreshScriptsCommand = true) {
        this.loadedScripts = [];
        const rootPath = (0, GetRootPath_1.default)();
        if (rootPath) {
            const folderPath = path_1.default.join(rootPath, ".workbench", "scripts");
            if (!(0, fs_1.existsSync)(folderPath)) {
                return;
            }
            const files = (0, fs_1.readdirSync)(folderPath);
            for (let file of files) {
                if (file.startsWith("index.")) {
                    continue;
                }
                if (file.endsWith(".ts")) {
                    const filePath = path_1.default.join(folderPath, file);
                    const script = new TypescriptScript_1.default(filePath);
                    this.loadedScripts.push(script);
                }
            }
        }
        if (sendRefreshScriptsCommand) {
            vscode_1.commands.executeCommand(`integrationWorkbench.refreshScripts`);
        }
        return this.loadedScripts;
    }
    static buildScriptIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield esbuild_1.default.build({
                bundle: true,
                stdin: {
                    contents: ''
                },
                inject: this.loadedScripts.map((script) => script.filePath),
                outfile: "index.js",
                format: "cjs",
                write: false,
                treeShaking: false
            });
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                for (let out of result.outputFiles) {
                    if (out.path.endsWith("index.js")) {
                        resolve(out.text);
                    }
                }
            }));
        });
    }
    static buildScriptIndexDeclaration() {
        return __awaiter(this, void 0, void 0, function* () {
            const compilerOptions = {
                declaration: true,
                allowJs: true,
                esModuleInterop: true,
                module: typescript_1.ModuleKind.AMD,
                outFile: "index.js"
            };
            for (let script of this.loadedScripts) {
                (0, typescript_1.createSourceFile)(script.getName(), script.getScript(), typescript_1.ScriptTarget.Latest, true, typescript_1.ScriptKind.TS);
            }
            const program = (0, typescript_1.createProgram)({
                rootNames: this.loadedScripts.map((script) => script.getName()),
                options: compilerOptions
            });
            return new Promise((resolve, reject) => {
                let declaration, javascript;
                const result = program.emit(undefined, (fileName, data) => {
                    console.log({ fileName });
                    if (fileName.endsWith(".d.ts")) {
                        declaration = data;
                    }
                    else if (fileName.endsWith(".js")) {
                        javascript = data;
                    }
                    if (declaration && javascript) {
                        console.log("index", { declaration, javascript });
                        resolve({
                            declaration,
                            javascript
                        });
                    }
                });
                const diagnostics = (0, typescript_1.getPreEmitDiagnostics)(program).concat(result.diagnostics);
                if (diagnostics.length > 0) {
                    const error = (0, typescript_1.formatDiagnosticsWithColorAndContext)(diagnostics, {
                        getCanonicalFileName: fileName => fileName,
                        getCurrentDirectory: () => process.cwd(),
                        getNewLine: () => typescript_1.sys.newLine,
                    });
                    console.error("Failed to build files:", error);
                    reject(error);
                }
                else {
                    console.log('Build files generated successfully.');
                }
            });
        });
    }
}
Scripts.loadedScripts = [];
Scripts.loadedDependencies = [];
exports.default = Scripts;
//# sourceMappingURL=Scripts.js.map