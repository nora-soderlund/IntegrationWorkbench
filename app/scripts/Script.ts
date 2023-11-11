import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { ExtensionContext, Uri, commands, window } from "vscode";
import ts from "typescript";
import { ScriptData } from "~interfaces/scripts/ScriptData";
import { ScriptDeclarationData } from "~interfaces/scripts/ScriptDeclarationData";
import { ScriptWebviewPanel } from "../panels/ScriptWebviewPanel";
import ScriptTreeItem from "../workbenches/trees/scripts/items/ScriptTreeItem";

export default class Script {
  public name: string;
  public nameWithoutExtension: string;
  private readonly directory: string;
  public content: string;
  
  public javascript?: string;
  public declaration?: string;

  public scriptWebviewPanel?: ScriptWebviewPanel;
  public treeDataViewItem?: ScriptTreeItem;

  constructor(filePath: string) {
    const parsedPath = path.parse(filePath);

    this.nameWithoutExtension = parsedPath.name;
    this.name = parsedPath.base;
    this.directory = parsedPath.dir;

    this.content = readFileSync(filePath, {
      encoding: "utf-8"
    });

    if(existsSync(path.join(this.directory, 'build', this.nameWithoutExtension + ".d.ts"))) {
      this.declaration = readFileSync(path.join(this.directory, 'build', this.nameWithoutExtension + ".d.ts"), {
        encoding: "utf-8"
      });
    }
  }

  setName(name: string) {
    rmSync(path.join(this.directory, this.name));
    this.deleteBuild();

    this.name = name + ".ts";
    this.nameWithoutExtension = name;

    this.save();

    this.createBuild();

    if(this.scriptWebviewPanel) {
      this.scriptWebviewPanel.webviewPanel.title = this.name;
    }

    this.treeDataViewItem?.update();
    this.treeDataViewItem?.treeDataProvider.refresh();
  }

  save() {
    try {
      if (!existsSync(this.directory)) {
        mkdirSync(this.directory, {
          recursive: true
        });
      }
    }
    catch (error) {
      window.showErrorMessage("VS Code may not have permissions to create files in the current workspace folder:\n\n" + error);
    }

    try {
      writeFileSync(path.join(this.directory, this.name), this.content);
    }
    catch (error) {
      window.showErrorMessage(`Failed to save workbench '${this.name}':\n\n` + error);
    }
  }

  setContent(content: string) {
    this.content = content;

    this.deleteBuild();
    
    this.save();
  }

  deleteBuild() {
    delete this.declaration;

    const declarationFilePath = path.join(this.directory, 'build', this.nameWithoutExtension + ".d.ts");
    
    if(existsSync(declarationFilePath)) {
      rmSync(declarationFilePath);
    }

    const javascriptFilePath = path.join(this.directory, 'build', this.nameWithoutExtension + ".js");
    
    if(existsSync(javascriptFilePath)) {
      rmSync(javascriptFilePath);
    }
  }

  async createBuild() {
    this.createBuildDirectory();

    const { declaration, javascript } = await this.build();

    writeFileSync(path.join(this.directory, 'build', this.nameWithoutExtension + ".d.ts"), declaration);
    writeFileSync(path.join(this.directory, 'build', this.nameWithoutExtension + ".js"), javascript);

    this.declaration = declaration;
    this.javascript = javascript;
  }

  createBuildDirectory() {
    const buildDirectory = path.join(this.directory, 'build');

    if (!existsSync(buildDirectory)) {
      mkdirSync(buildDirectory, {
        recursive: true
      });
    }
  }

  build() {
    const compilerOptions = {
      declaration: true,
      allowJs: true,
    };

    ts.createSourceFile(
      path.join(this.directory, this.name),
      this.content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    );

    const program = ts.createProgram({
      rootNames: [ path.join(this.directory, this.name) ],
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
      name: this.name,
      content: this.content
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
      name: `ts:${this.nameWithoutExtension}.d.ts`,
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
