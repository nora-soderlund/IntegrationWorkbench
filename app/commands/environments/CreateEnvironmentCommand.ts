import { ExtensionContext, commands, window } from "vscode";
import getUniqueFolderPath from "../../utils/GetUniqueFolderPath";
import getCamelizedString from "../../utils/GetCamelizedString";
import getRootPath from "../../utils/GetRootPath";
import { Workbench } from "../../workbenches/Workbench";
import path from "path";
import { workbenches } from "../../Workbenches";
import { randomUUID } from "crypto";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import Environments from "../../Environments";
import { EnvironmentData } from "~interfaces/entities/EnvironmentData";
import Environment from "../../entities/environments/Environment";

export default class CreateEnvironmentCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.createEnvironment', this.handle.bind(this))
    );
  }
  
  async handle() {
    const name = await window.showInputBox({
      placeHolder: "Enter the name of this environment:",
  
      validateInput(value) {
        if(!value.length) {
          return "You must enter a name for this environment!";
        }
  
        return null;
      },
    });
  
    if(!name) {
      return;
    }

    const rootPath = getRootPath();

    if(!rootPath) {
      window.showErrorMessage("You must be in a workspace to create an environment!");

      return;
    }
  
    Environments.createFolder(rootPath);

    const environmentsPath = Environments.getPath(rootPath);
  
    const uniqueEnvironmentPath = getUniqueFolderPath(environmentsPath, getCamelizedString(name), ".json");
  
    if(!uniqueEnvironmentPath) {
      window.showErrorMessage("There is too many environments with the same name in this storage option, please choose a different name.");
  
      return null;
    }

    const environmentData: EnvironmentData = {
      name,
      variables: [],
      variablesAutoRefresh: false
    };

    writeFileSync(uniqueEnvironmentPath, JSON.stringify(environmentData, undefined, 2));
  
    const environment = new Environment(uniqueEnvironmentPath);
  
    Environments.loadedEnvironments.push(environment);
  
    commands.executeCommand("integrationWorkbench.refreshEnvironments");
  };
}
