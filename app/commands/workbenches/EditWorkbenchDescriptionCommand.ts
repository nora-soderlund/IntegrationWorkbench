import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchTreeItem";
import { WorkbenchCollection } from "../../workbenches/collections/WorkbenchCollection";
import { randomUUID } from "crypto";
import WorkbenchCollectionTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchCollectionTreeItem";
import { Workbench } from "../../workbenches/Workbench";
import getRootPath from "../../utils/GetRootPath";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import getUniqueFolderPath from "../../utils/GetUniqueFolderPath";
import getCamelizedString from "../../utils/GetCamelizedString";

export default class EditWorkbenchDescriptionCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.editWorkbenchDescription', this.handle.bind(this))
    );
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
