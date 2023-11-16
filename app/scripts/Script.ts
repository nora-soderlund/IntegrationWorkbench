import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { ExtensionContext, Uri, window } from "vscode";
import ts from "typescript";
import { ScriptData } from "~interfaces/scripts/ScriptData";
import { ScriptContentData } from "~interfaces/scripts/ScriptContentData";
import { ScriptDeclarationData } from "~interfaces/scripts/ScriptDeclarationData";
import { ScriptWebviewPanel } from "../panels/ScriptWebviewPanel";
import ScriptTreeItem from "../workbenches/trees/scripts/items/ScriptTreeItem";

export default class Script {
  public typescript?: string;
  
  public javascript?: string;
  public declaration?: string;

  public scriptWebviewPanel?: ScriptWebviewPanel;
  public treeDataViewItem?: ScriptTreeItem;

  constructor(public rootPath: string, public data: ScriptData) {
  }

  getDataPath() {
    return path.join(this.rootPath, ".workbench", "scripts", `${this.data.name}.json`);
  }

  getTypeScriptPath() {
    return path.join(this.rootPath, ".workbench", "scripts", `${this.data.name}.ts`);
  }

  getJavaScriptPath() {
    return path.join(this.rootPath, ".workbench", "scripts", 'build', `${this.data.name}.js`);
  }

  getDeclarationPath() {
    return path.join(this.rootPath, ".workbench", "scripts", 'build', `${this.data.name}.d.ts`);
  }

  setName(name: string) {
    this.delete();
    this.deleteBuild();

    this.data.name = name;

    this.save();

    this.createBuild();

    if(this.scriptWebviewPanel) {
      this.scriptWebviewPanel.webviewPanel.title = this.data.name;
    }

    if(this.treeDataViewItem) {
      this.treeDataViewItem.update();
      this.treeDataViewItem.treeDataProvider.refresh(); 
    }
  }

  delete() {
    const scriptPath = this.getTypeScriptPath();
    const declarationPath = this.getDeclarationPath();

    rmSync(scriptPath);
    rmSync(declarationPath);
  }

  save() {
    const dataPath = this.getDataPath();

    try {
      const directoryPath = path.dirname(dataPath);

      if (!existsSync(directoryPath)) {
        mkdirSync(directoryPath, {
          recursive: true
        });
      }
    }
    catch (error) {
      window.showErrorMessage("VS Code may not have permissions to create files in the current workspace folder:\n\n" + error);
    }

    try {
      const typeScriptPath = this.getTypeScriptPath();

      writeFileSync(dataPath, JSON.stringify(this.getData(), undefined, 2));
      writeFileSync(typeScriptPath, this.typescript ?? "");
    }
    catch (error) {
      window.showErrorMessage(`Failed to save script '${this.data.name}':\n\n` + error);
    }
  }

  setContent(content: string) {
    this.typescript = content;

    this.deleteBuild();
    
    this.save();
  }

  deleteBuild() {
    delete this.declaration;

    const declarationFilePath = this.getDeclarationPath();
    
    if(existsSync(declarationFilePath)) {
      rmSync(declarationFilePath);
    }

    const scriptPath = this.getTypeScriptPath();
    
    if(existsSync(scriptPath)) {
      rmSync(scriptPath);
    }
  }

  async createBuild() {
    this.createBuildDirectory();

    const { declaration, javascript } = await this.build();

    const buildPath = this.getJavaScriptPath();
    const declarationPath = this.getDeclarationPath();

    writeFileSync(buildPath, javascript);
    writeFileSync(declarationPath, declaration);

    this.declaration = declaration;
    this.javascript = javascript;
  }

  createBuildDirectory() {
    const buildPath = this.getJavaScriptPath();

    const buildDirectory = path.dirname(buildPath);

    if (!existsSync(buildDirectory)) {
      mkdirSync(buildDirectory, {
        recursive: true
      });
    }
  }

  build() {
    const compilerOptions: ts.CompilerOptions = {
      declaration: true,
      allowJs: true,
      module: ts.ModuleKind.ESNext
    };

    const typescriptPath = this.getTypeScriptPath();

    ts.createSourceFile(
      typescriptPath,
      this.typescript ?? "",
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    );

    const program = ts.createProgram({
      rootNames: [ typescriptPath ],
      options: compilerOptions,
    });

    return new Promise<{
      declaration: string;
      javascript: string;
    }>((resolve, reject) => {
      let declaration: string, javascript: string;

      const result = program.emit(undefined, (fileName, data) => {
        if (fileName.endsWith('.d.ts')) {
          declaration = data;
        }
        else if (fileName.endsWith('.js')) {
          javascript = data;
        }

        if(declaration && javascript) {
          resolve({
            declaration,
            javascript
          });
        }
      });

      const diagnostics = ts.getPreEmitDiagnostics(program).concat(result.diagnostics);

      if (diagnostics.length > 0) {
        console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
          getCanonicalFileName: fileName => fileName,
          getCurrentDirectory: () => process.cwd(),
          getNewLine: () => ts.sys.newLine,
        }));

        reject();
      }
      else {
        console.log('Build files generated successfully.');
      }
    });
  }

  getData(): ScriptData {
    return {
      name: this.data.name,
      description: this.data.description,
      type: this.data.type
    };
  }

  getContentData(): ScriptContentData {
    return {
      ...this.getData(),
      typescript: this.typescript ?? ""
    };
  }

  async getDeclarationData(): Promise<ScriptDeclarationData | null> {
    if(!this.declaration || !this.javascript) {
      await this.createBuild();
    }

    if(!this.declaration || !this.javascript) {
      return null;
    }

    return {
      name: `ts:${this.data.name}.d.ts`,
      declaration: this.declaration
    };
  }

  showWebviewPanel(context: ExtensionContext) {
    if(!this.scriptWebviewPanel) {
      this.scriptWebviewPanel = new ScriptWebviewPanel(context, this);

      if(this.treeDataViewItem?.iconPath instanceof Uri) {
        this.setWebviewPanelIcon(this.treeDataViewItem.iconPath);
      }
    }
    else {
      this.scriptWebviewPanel.reveal();
    }
		
    //commands.executeCommand("integrationWorkbench.openResponse", this);
  }

  setWebviewPanelIcon(icon: Uri) {
    if(this.scriptWebviewPanel) {
      this.scriptWebviewPanel.webviewPanel.iconPath = icon;
    }
  }

  deleteWebviewPanel() {
    delete this.scriptWebviewPanel;
  }

  disposeWebviewPanel() {
    this.scriptWebviewPanel?.dispose();
  }
}
