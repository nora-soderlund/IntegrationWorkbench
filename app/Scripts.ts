import { ExtensionContext, commands } from "vscode";
import { existsSync, readdirSync } from "fs";
import path from "path";
import getRootPath from "./utils/GetRootPath";
import Script from "./scripts/Script";

export default class Scripts {
  static loadedScripts: Script[] = [];

  static scanForScripts(context: ExtensionContext, sendRefreshScriptsCommand: boolean = true) {
    this.loadedScripts = [];

    const rootPaths = [
      context.globalStorageUri.fsPath,
      getRootPath()
    ];
  
    for(let rootPath of rootPaths) {
      if(!rootPath) {
        continue;
      }
  
      if(!existsSync(path.join(rootPath, ".workbench", "scripts"))) {
        continue;
      }
  
      const files = readdirSync(path.join(rootPath, ".workbench", "scripts"));
  
      for(let file of files) {
        if(file.endsWith(".js")) {
          this.loadedScripts.push(
            new Script(file)
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
