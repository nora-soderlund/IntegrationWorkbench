import path from "path";
import Environment from "./entities/Environment";
import { existsSync, mkdirSync, readdirSync } from "fs";
import getRootPath from "./utils/GetRootPath";
import { ExtensionContext, StatusBarAlignment, StatusBarItem, commands, window, workspace } from "vscode";

export default class Environments {
  public static loadedEnvironments: Environment[] = [];

  public static statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 0);

  public static selectedEnvironment: Environment | null;

  public static getPath(rootPath: string) {
    return path.join(rootPath, ".workbench/", "environments/");
  }

  public static createFolder(rootPath: string) {
    const scriptsPath = this.getPath(rootPath);

    if(!existsSync(scriptsPath)) {
      mkdirSync(scriptsPath, {
        recursive: true
      });
    }
    
    return scriptsPath;
  }

  public static createStatusBarItem(context: ExtensionContext) {    
    this.statusBarItem.command = {
      command: "integrationWorkbench.selectEnvironment",
      title: "Select environment"
    };

    this.statusBarItem.show();

    const selectedEnvironmentName = context.workspaceState.get("selectedEnvironment");
    const selectedEnvironment = this.loadedEnvironments.find((environment) => environment.data.name === selectedEnvironmentName);

    if(selectedEnvironment) {
      this.selectEnvironment(context, selectedEnvironment);
    }
    else {
      this.selectEnvironment(context, null);
    }
  }

  public static selectEnvironment(context: ExtensionContext, environment: Environment | null) {
    context.workspaceState.update("selectedEnvironment", environment?.data.name ?? null);

    if(environment) {
      this.statusBarItem.text = `$(server-environment) ${environment.data.name}`;
    }
    else {
      this.statusBarItem.text = "$(server-environment) Select environment";
    }

    this.selectedEnvironment = environment;
  }

  public static scan(sendRefreshCommand: boolean = true) {
    this.loadedEnvironments = [];
    
    const rootPath = getRootPath();

    if(rootPath) {
      const folderPath = this.getPath(rootPath);
  
      if(!existsSync(folderPath)) {
        return;
      }
  
      const files = readdirSync(folderPath);
  
      for(let file of files) {
        if(file.endsWith(".json")) {
          const filePath = path.join(folderPath, file);

          this.loadedEnvironments.push(
            new Environment(filePath)
          );
        }
      }
    }
  
    if(sendRefreshCommand) {
      commands.executeCommand(`integrationWorkbench.refreshEnvironments`);
    }
  
    return this.loadedEnvironments;
  }

  public static async getEnvironmentInjection(environment?: Environment) {
    if(!environment) {
      if(!this.selectedEnvironment) {
        return "";
      }

      environment = this.selectedEnvironment;
    }

    const parsedVariables = await environment.getParsedVariables(new AbortController());

    return `const process = { env: { ${parsedVariables.map((parsedVariable) => `${parsedVariable.key}: ${JSON.stringify(parsedVariable.value)}`).join(', ')} } };`;
  }

  public static async getEnvironmentDeclaration(environment?: Environment) {
    if(!environment) {
      if(!this.selectedEnvironment) {
        return "";
      }

      environment = this.selectedEnvironment;
    }

    const parsedVariables = await environment.getParsedVariables(new AbortController());

    return `declare const process: { env: { ${parsedVariables.map((parsedVariable) => `${parsedVariable.key}: any;`).join(' ')} }; };`;
  }
}