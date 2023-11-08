import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchTreeItem";
import { randomUUID } from "crypto";
import WorkbenchRequestTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchRequestTreeItem";
import WorkbenchRequest from "../../workbenches/requests/WorkbenchRequest";

export default class DeleteRequestCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.deleteRequest', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    let request: WorkbenchRequest;

    if(reference instanceof WorkbenchRequestTreeItem) {
      request = reference.request;
    }
    else {
      throw new Error("Unknown entry point for deleting request.");
    }

    reference.request.parent?.removeRequest(reference.request);
  }
}
