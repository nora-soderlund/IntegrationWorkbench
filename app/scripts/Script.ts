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

    if(existsSync(path.join(this.directory, this.nameWithoutExtension + ".d.ts"))) {
      this.declaration = this.getDeclaration();
    }
  }

  setName(name: string) {
    rmSync(path.join(this.directory, this.name));

    this.name = name + ".ts";
    this.nameWithoutExtension = name;

    this.save();

    this.declaration = this.getDeclaration();

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

    const declarationFilePath = path.join(this.directory, this.nameWithoutExtension + ".d.ts");

    if(existsSync(declarationFilePath)) {
      delete this.declaration;
      
      rmSync(declarationFilePath);
    }
    
    this.save();
  }

  getDeclaration() {
    const compilerOptions = {
      declaration: true,
      allowJs: true,
    };

    const program = ts.createProgram({
      rootNames: [ this.name ],
      options: compilerOptions,
    });

    let declaration: string = "";

    program.emit(undefined, (fileName, data) => {
      if (fileName.endsWith('.d.ts')) {
        declaration = data;
      }
    });

    return declaration;
  }

  getData(): ScriptData {
    return {
      name: this.name,
      content: this.content
    };
  }

  getDeclarationData(): ScriptDeclarationData {
    if(!this.declaration) {
      this.declaration = this.getDeclaration();
      
      writeFileSync(path.join(this.directory, this.nameWithoutExtension + ".d.ts"), this.declaration); 
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
