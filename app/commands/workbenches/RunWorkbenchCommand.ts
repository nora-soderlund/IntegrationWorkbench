import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import { randomUUID } from "crypto";
import { Workbench } from "../../entities/workbenches/Workbench";
import Command from "../Command";

export default class RunWorkbenchCommand extends Command {
  constructor(context: ExtensionContext) {
    super(context, 'integrationWorkbench.runWorkbench');
  }
  
  async handle(reference: unknown) {
    let workbench: Workbench;

    if(reference instanceof WorkbenchTreeItem) {
      workbench = reference.workbench;
    }
    else {
      throw new Error("Unknown entry point for running workbench.");
    }
    
    [...workbench.collections].reverse().forEach((collection) => {
      [...collection.requests].reverse().forEach((request) => {
        request.send();
      });
    });
    
    [...workbench.requests].reverse().forEach((request) => {
      request.send();
    });
  }
}
