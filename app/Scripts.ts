import { ExtensionContext, TaskPanelKind, commands } from "vscode";
import { existsSync, mkdir, mkdirSync, readFileSync, readdirSync, rmdirSync, writeFileSync } from "fs";
import path from "path";
import getRootPath from "./utils/GetRootPath";
import Script from "./scripts/Script";
import { ScriptStorageType } from "~interfaces/scripts/ScriptStorageType";
import { ScriptData } from "~interfaces/scripts/ScriptData";
import { exec, execSync } from "child_process";
import { ScriptDeclarationData } from "~interfaces/scripts/ScriptDeclarationData";

export default class Scripts {
  static loadedScripts: Script[] = [];
  static loadedDependencies: ScriptDeclarationData[] = [];

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

          const script = new Script(rootPath, data);

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

  static generateScriptDependencyDeclaration(rootPath: string, dependency: string) {
    return new Promise<void>((resolve) => {
      const scriptNodeModulesPath = path.join(rootPath, ".workbench", "scripts", "node_modules");

      if(!existsSync(scriptNodeModulesPath)) {
        mkdirSync(scriptNodeModulesPath, {
          recursive: true
        });
      }

      let declaration: string;
      let dependencyDeclarationPath: string;

      if(dependency.includes('/')) {
        const [ directory, dependencyName ] = dependency.split('/');
        
        const dependencyPath = path.join(scriptNodeModulesPath, directory);

        if(!existsSync(dependencyPath)) {
          mkdirSync(dependencyPath);
        }

        dependencyDeclarationPath = path.join(dependencyPath, `${dependencyName}.d.ts`);

        declaration = execSync(`npx dts-gen -m ${dependency} -s`, {
          cwd: rootPath,
          encoding: "utf-8"
        });
      }
      else {
        dependencyDeclarationPath = path.join(scriptNodeModulesPath, `${dependency}.d.ts`);

        declaration = execSync(`npx dts-gen -m ${dependency} -f ${dependencyDeclarationPath} --overwrite`, {
          cwd: rootPath,
          encoding: "utf-8"
        });
      }

      const index = this.loadedDependencies.findIndex((loadedDependency) => loadedDependency.name === dependency);

      if(index !== -1) {
        this.loadedDependencies.splice(index, 1);
      }

      declaration = declaration.replace(/export/g, 'declare');

      writeFileSync(dependencyDeclarationPath, declaration);

      this.loadedDependencies.push({
        name: dependency,
        declaration
      });

      resolve();
    });
  }

  static generateScriptDependencyDeclarations() {
    const rootPath = getRootPath();

    if(!rootPath) {
      return;
    }

    const scriptNodeModulesPath = path.join(rootPath, ".workbench", "scripts", "node_modules");

    if(existsSync(scriptNodeModulesPath)) {
      rmdirSync(scriptNodeModulesPath, {
        recursive: true
      });
    }

    mkdirSync(scriptNodeModulesPath, {
      recursive: true
    });

    this.loadedDependencies = [];

    const dependencies = [...new Set(this.loadedScripts.flatMap((script) => script.data.dependencies))];

    for(let dependency of dependencies) {
      this.generateScriptDependencyDeclaration(rootPath, dependency);
    }
  }
}
