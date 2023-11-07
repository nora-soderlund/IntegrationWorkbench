import { ExtensionContext, commands, window } from "vscode";
import { Workbench } from "../../workbenches/Workbench";
import WorkbenchTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchTreeItem";
import { scanForWorkbenches } from "../../Workbenches";

export default class DeleteWorkbenchCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.deleteWorkbench', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    let workbench: Workbench;

    if(reference instanceof WorkbenchTreeItem) {
      workbench = reference.workbench;
    }
    else {
      throw new Error("Unknown entry point for deleting workbench.");
    }

    workbench.collections.forEach((collection) => workbench.removeCollection(collection));
    workbench.requests.forEach((request) => workbench.removeRequest(request));

    workbench.delete();

    scanForWorkbenches(this.context, true);
  }
}
