import { ExtensionContext, commands } from "vscode";
import { existsSync, readdirSync } from "fs";
import path from "path";
import getRootPath from "./utils/GetRootPath";
import Script from "./scripts/Script";
import { ScriptStorageType } from "~interfaces/scripts/ScriptStorageType";

export default class Scripts {
  static loadedScripts: Script[] = [];

  static scanForScripts(context: ExtensionContext, sendRefreshScriptsCommand: boolean = true) {
    this.loadedScripts = [];
    
    const rootPath = getRootPath();

    if(rootPath) {
      const folderPath = path.join(rootPath, ".workbench", "scripts");
  
      if(!existsSync(folderPath)) {
        return;
      }
  
      const files = readdirSync(folderPath);
  
      for(let file of files) {
        if(file.endsWith(".ts") && !file.endsWith(".d.ts")) {
          this.loadedScripts.push(
            new Script(path.join(folderPath, file))
          );
        }
      }
    }
  
    if(sendRefreshScriptsCommand) {
      commands.executeCommand(`integrationWorkbench.refreshScripts`);
    }
  
    return this.loadedScripts;
  }
}
