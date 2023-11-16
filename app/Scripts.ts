import { ExtensionContext, TaskPanelKind, commands } from "vscode";
import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";
import getRootPath from "./utils/GetRootPath";
import Script from "./scripts/Script";
import { ScriptStorageType } from "~interfaces/scripts/ScriptStorageType";
import { ScriptData } from "~interfaces/scripts/ScriptData";

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
        if(file.endsWith(".json")) {
          const dataPath = path.join(folderPath, file);

          const data: ScriptData = JSON.parse(readFileSync(dataPath, {
            encoding: "utf-8"
          }));

          const script = new Script(rootPath, {
            name: data.name,
            description: data.description,
            type: data.type
          });

          switch(data.type) {
            case "typescript": {
              const typescriptPath = path.join(folderPath, script.data.name + '.ts');
   
              if(existsSync(typescriptPath)) {
                script.typescript = readFileSync(typescriptPath, {
                  encoding: "utf-8"
                });
              }

              const javascriptPath = path.join(folderPath, 'build', script.data.name + '.js');
              
              if(existsSync(javascriptPath)) {
                script.javascript = readFileSync(javascriptPath, {
                  encoding: "utf-8"
                });
              }

              const declarationPath = path.join(folderPath, 'build', script.data.name + '.d.ts');
              
              if(existsSync(declarationPath)) {
                script.declaration = readFileSync(declarationPath, {
                  encoding: "utf-8"
                });
              }

              break;
            }
          }

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
