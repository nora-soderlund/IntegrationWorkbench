import { ExtensionContext, TaskPanelKind, commands, window } from "vscode";
import { existsSync, mkdir, mkdirSync, readFileSync, readdirSync, rmdirSync, writeFileSync } from "fs";
import path from "path";
import getRootPath from "./utils/GetRootPath";
import Script from "./scripts/TypescriptScript";
import { ScriptDeclarationData } from "~interfaces/scripts/ScriptDeclarationData";
import TypescriptScript from "./scripts/TypescriptScript";
import { CompilerOptions, ModuleKind, ScriptKind, ScriptTarget, createProgram, createSourceFile, formatDiagnosticsWithColorAndContext, getPreEmitDiagnostics, sys } from "typescript";
import esbuild from "esbuild";

export default class Scripts {
  static loadedScripts: Script[] = [];
  static loadedDependencies: ScriptDeclarationData[] = [];

  static getScriptsPath(rootPath: string) {
    return path.join(rootPath, ".workbench/", "scripts/");
  }

  static createScriptsFolder(rootPath: string) {
    const scriptsPath = this.getScriptsPath(rootPath);

    if(!existsSync(scriptsPath)) {
      mkdirSync(scriptsPath, {
        recursive: true
      });
    }
    
    return scriptsPath;
  };

  static scanForScripts(sendRefreshScriptsCommand: boolean = true) {
    this.loadedScripts = [];
    
    const rootPath = getRootPath();

    if(rootPath) {
      const folderPath = path.join(rootPath, ".workbench", "scripts");
  
      if(!existsSync(folderPath)) {
        return;
      }
  
      const files = readdirSync(folderPath);
  
      for(let file of files) {
        if(file.startsWith("index.")) {
          continue;
        }

        if(file.endsWith(".ts")) {
          const filePath = path.join(folderPath, file);

          const script = new TypescriptScript(filePath);

          this.loadedScripts.push(script);
        }
      }
    }
  
    if(sendRefreshScriptsCommand) {
      commands.executeCommand(`integrationWorkbench.refreshScripts`);
    }
  
    return this.loadedScripts;
  }

  static async buildScriptIndex() {
    const result = await esbuild.build({
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

    return new Promise<string>(async (resolve) => {
      for (let out of result.outputFiles) {
        if(out.path.endsWith("index.js")) {
          resolve(out.text);
        }
      }
    });
  }

  static async buildScriptIndexDeclaration() {
    const compilerOptions: CompilerOptions = {
      declaration: true,
      allowJs: true,
      esModuleInterop: true,
      module: ModuleKind.AMD,
      outFile: "index.js"
    };

    for(let script of this.loadedScripts) {
      createSourceFile(
        script.getName(),
        script.getScript(),
        ScriptTarget.Latest,
        true,
        ScriptKind.TS
      );
    }

    const program = createProgram({
      rootNames: this.loadedScripts.map((script) => script.getName()),
      options: compilerOptions
    });

    return new Promise<{
      declaration: string;
      javascript: string;
    }>((resolve, reject) => {
      let declaration: string, javascript: string;

      const result = program.emit(undefined, (fileName, data) => {
        console.log({ fileName });

        if (fileName.endsWith(".d.ts")) {
          declaration = data;
        }
        else if (fileName.endsWith(".js")) {
          javascript = data;
        }

        if(declaration && javascript) {
          console.log("index", { declaration, javascript });
          
          resolve({
            declaration,
            javascript
          });
        }
      });

      const diagnostics = getPreEmitDiagnostics(program).concat(result.diagnostics);

      if (diagnostics.length > 0) {
        const error = formatDiagnosticsWithColorAndContext(diagnostics, {
          getCanonicalFileName: fileName => fileName,
          getCurrentDirectory: () => process.cwd(),
          getNewLine: () => sys.newLine,
        });

        console.error("Failed to build files:", error);

        reject(error);
      }
      else {
        console.log('Build files generated successfully.');
      }
    });
  }
}
