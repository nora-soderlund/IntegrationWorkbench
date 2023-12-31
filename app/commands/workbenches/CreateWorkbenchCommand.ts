import { ExtensionContext, commands, window } from "vscode";
import getUniqueFolderPath from "../../utils/GetUniqueFolderPath";
import getCamelizedString from "../../utils/GetCamelizedString";
import getRootPath from "../../utils/GetRootPath";
import { Workbench } from "../../entities/workbenches/Workbench";
import path from "path";
import Workbenches from "../../instances/Workbenches";
import { randomUUID } from "crypto";
import { existsSync, mkdirSync } from "fs";
import Command from "../Command";

export default class CreateWorkbenchCommand extends Command {
  constructor(context: ExtensionContext) {
    super(context, 'norasoderlund.integrationworkbench.createWorkbench');
  }
  
  async handle() {
    const name = await window.showInputBox({
      placeHolder: "Enter the name of this workbench:",
  
      validateInput(value) {
        if(!value.length) {
          return "You must enter a name for this workbench!";
        }
  
        return null;
      },
    });
  
    if(!name) {
      return;
    }

    const rootPath = getRootPath();

    if(!rootPath) {
      window.showErrorMessage("You must be in a workspace to create a workbench!");

      return;
    }
  
    const workbenchesPath = path.join(rootPath, ".workbench/", "workbenches/");

    try {
      if(!existsSync(workbenchesPath)) {
        mkdirSync(workbenchesPath, {
          recursive: true
        });
      }
    }
    catch(error) {
      window.showErrorMessage("Failed to create workbenches folder: " + error);

      return;
    }
  
    const uniqueWorkbenchPath = getUniqueFolderPath(workbenchesPath, getCamelizedString(name));
  
    if(!uniqueWorkbenchPath) {
      window.showErrorMessage("There is too many workbenches with the same name in this storage option, please choose a different name.");
  
      return null;
    }
  
    const workbench = new Workbench({
      id: randomUUID(),
      name,
      description: path.basename(path.dirname(path.dirname(path.dirname(uniqueWorkbenchPath)))),
      requests: [],
      collections: []
    }, uniqueWorkbenchPath);
  
    workbench.save();
  
    Workbenches.workbenches.push(workbench);
  
    commands.executeCommand("norasoderlund.integrationworkbench.refreshWorkbenches");
  };
}
