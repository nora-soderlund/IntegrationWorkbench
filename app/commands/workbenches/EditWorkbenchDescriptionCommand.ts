import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import { WorkbenchCollection } from "../../entities/collections/WorkbenchCollection";
import { randomUUID } from "crypto";
import WorkbenchCollectionTreeItem from "../../views/trees/workbenches/items/WorkbenchCollectionTreeItem";
import { Workbench } from "../../entities/workbenches/Workbench";
import getRootPath from "../../utils/GetRootPath";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import getUniqueFolderPath from "../../utils/GetUniqueFolderPath";
import getCamelizedString from "../../utils/GetCamelizedString";
import Command from "../Command";

export default class EditWorkbenchDescriptionCommand extends Command {
  constructor(context: ExtensionContext) {
    super(context, 'integrationWorkbench.editWorkbenchDescription');
  }
  
  async handle(reference: unknown) {
    let workbench: Workbench;

    if(reference instanceof WorkbenchTreeItem) {
      workbench = reference.workbench;
    }
    else {
      throw new Error("Unknown entry point for editing workbench description.");
    }

    window.showInputBox({
      prompt: "Enter a workbench description",
      value: workbench.description
    }).then((description) => {
      workbench.description = description;

      workbench.save();

      commands.executeCommand("integrationWorkbench.refreshWorkbenches");
    });
  }
}
