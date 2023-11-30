import { ExtensionContext, TaskPanelKind, commands, window } from "vscode";
import { existsSync, mkdir, mkdirSync, readFileSync, readdirSync, rmdirSync, writeFileSync } from "fs";
import path from "path";
import getRootPath from "./utils/GetRootPath";
import Script from "./scripts/TypescriptScript";
import { ScriptDeclarationData } from "~interfaces/scripts/ScriptDeclarationData";
import TypescriptScript from "./scripts/TypescriptScript";

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
}
