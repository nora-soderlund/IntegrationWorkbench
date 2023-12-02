import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import { randomUUID } from "crypto";
import WorkbenchRequestTreeItem from "../../views/trees/workbenches/items/WorkbenchRequestTreeItem";
import WorkbenchRequest from "../../entities/requests/WorkbenchRequest";

export default class RunRequestCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.runRequest', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    let request: WorkbenchRequest;

    if(reference instanceof WorkbenchRequestTreeItem) {
      request = reference.request;
    }
    else {
      throw new Error("Unknown entry point for editing request name.");
    }

    request.send();
  }
}
