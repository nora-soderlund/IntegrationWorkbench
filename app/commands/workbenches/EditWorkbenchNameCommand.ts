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

export default class EditWorkbenchNameCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.editWorkbenchName', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    let workbench: Workbench;

    if(reference instanceof WorkbenchTreeItem) {
      workbench = reference.workbench;
    }
    else {
      throw new Error("Unknown entry point for editing workbench name.");
    }

    window.showInputBox({
      prompt: "Enter a workbench name",
      value: workbench.name,
      validateInput(value) {
        if(!value.length) {
          return "You must enter a collection name or cancel.";
        }

        return null;
      },
    }).then((name) => {
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

      const currentPathDescription = path.basename(path.dirname(path.dirname(path.dirname(workbench.path))));

      workbench.delete();

      workbench.name = name;
      workbench.path = uniqueWorkbenchPath;

      if(workbench.description === currentPathDescription) {
        workbench.description = path.basename(path.dirname(path.dirname(path.dirname(workbench.path))));
      }

      workbench.save();

      commands.executeCommand("integrationWorkbench.refreshWorkbenches");
    });
  }
}
