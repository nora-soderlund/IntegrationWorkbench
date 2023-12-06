import { readFileSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { window } from "vscode";
import ts from "typescript";
import { ScriptDeclarationData } from "~interfaces/scripts/ScriptDeclarationData";
import ScriptTreeItem from "../../views/trees/scripts/items/ScriptTreeItem";

export type TypescriptScriptCache = {
  script: string;
  javascript: string;
  declaration: string;
};

export default class TypescriptScript {
  public treeDataViewItem?: ScriptTreeItem;

  public cache?: TypescriptScriptCache;

  constructor(public filePath: string) {
  }

  getName() {
    return path.basename(this.filePath);
  }

  getNameWithoutExtension() {
    const name = this.getName();

    return name.substring(0, name.length - path.extname(name).length);
  }

  setName(name: string) {
    const script = this.getScript();

    this.deleteScript();

    this.filePath = path.join(path.dirname(this.filePath), name);

    this.saveScript(script);

    if(this.treeDataViewItem) {
      this.treeDataViewItem.update();

      this.treeDataViewItem.treeDataProvider.refresh(); 
    }
  }

  deleteScript() {
    rmSync(this.filePath);
  }

  getScript() {
    return readFileSync(this.filePath, {
      encoding: "utf-8"
    });
  }

  saveScript(script: string) {
    try {
      writeFileSync(this.filePath, script, {
        encoding: "utf-8"
      });
    }
    catch (error) {
      window.showErrorMessage(`Failed to save script:\n\n` + error);
    }
  }

  async build() {
    const script = this.getScript();

    if(this.cache?.script === script) {
      return {
        declaration: this.cache.declaration,
        javascript: this.cache.javascript
      };
    }

    const compilerOptions: ts.CompilerOptions = {
      declaration: true,
      allowJs: true,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true
    };

    ts.createSourceFile(
      this.filePath,
      script,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    );

    const program = ts.createProgram({
      rootNames: [ this.filePath ],
      options: compilerOptions,
    });

    const result = await new Promise<{
      declaration: string;
      javascript: string;
    }>((resolve, reject) => {
      let declaration: string, javascript: string;

      const result = program.emit(undefined, (fileName, data) => {
        if (fileName.endsWith(`${this.getNameWithoutExtension()}.d.ts`)) {
          declaration = data;
        }
        else if (fileName.endsWith(`${this.getNameWithoutExtension()}.js`)) {
          javascript = data;
        }

        if(declaration && javascript) {
          console.log("nice", { declaration, javascript });
          
          resolve({
            declaration,
            javascript
          });
        }
      });

      const diagnostics = ts.getPreEmitDiagnostics(program).concat(result.diagnostics);

      if (diagnostics.length > 0) {
        const error = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
          getCanonicalFileName: fileName => fileName,
          getCurrentDirectory: () => process.cwd(),
          getNewLine: () => ts.sys.newLine,
        });

        console.error("Failed to build files:", error);

        reject(error);
      }
      else {
        console.log('Build files generated successfully.');
      }
    });

    this.cache = {
      script,
      javascript: result.javascript,
      declaration: result.declaration
    };

    return result;
  }

  async getDeclarationData(): Promise<ScriptDeclarationData> {
    const build = await this.build();

    return {
      name: `ts:${this.getNameWithoutExtension()}.d.ts`,
      declaration: build.declaration
    };
  }
}
