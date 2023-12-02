import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import { WorkbenchCollection } from "../../workbenches/collections/WorkbenchCollection";
import { randomUUID } from "crypto";
import WorkbenchCollectionTreeItem from "../../views/trees/workbenches/items/WorkbenchCollectionTreeItem";
import { Workbench } from "../../workbenches/Workbench";
import getRootPath from "../../utils/GetRootPath";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import getUniqueFolderPath from "../../utils/GetUniqueFolderPath";
import getCamelizedString from "../../utils/GetCamelizedString";
import Environment from "../../entities/environments/Environment";
import EnvironmentTreeItem from "../../views/trees/environments/items/EnvironmentTreeItem";
import Environments from "../../Environments";

export default class EditEnvironmentNameCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.editEnvironmentName', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    let environment: Environment;

    if(reference instanceof EnvironmentTreeItem) {
      environment = reference.environment;
    }
    else {
      throw new Error("Unknown entry point for editing environment name.");
    }

    const rootPath = getRootPath();

    if(!rootPath) {
      window.showErrorMessage("You must be in a workspace to edit an environment!");

      return;
    }

    const environmentsPath = Environments.getPath(rootPath);

    window.showInputBox({
      prompt: "Enter an environment name",
      value: environment.data.name,
      validateInput(value) {
        if(!value.length) {
          return "You must enter an environment name or cancel.";
        }

        return null;
      },
    }).then((name) => {
      if(!name) {
        return;
      }
    
      const uniqueWorkbenchPath = getUniqueFolderPath(environmentsPath, getCamelizedString(name), ".json");
    
      if(!uniqueWorkbenchPath) {
        window.showErrorMessage("There is too many environments with the same name in this storage option, please choose a different name.");
    
        return null;
      }

      environment.delete();

      environment.data.name = name;
      environment.filePath = uniqueWorkbenchPath;

      environment.save();

      commands.executeCommand("integrationWorkbench.refreshEnvironments");
    });
  }
}
