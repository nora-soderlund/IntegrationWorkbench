import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchTreeItem";
import { randomUUID } from "crypto";
import { Workbench } from "../../workbenches/Workbench";

export default class RunWorkbenchCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.runWorkbench', this.handle.bind(this))
    );
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
