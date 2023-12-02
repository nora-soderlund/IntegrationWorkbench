import { ExtensionContext, commands } from "vscode";
import { Workbench } from "../../workbenches/Workbench";
import WorkbenchRequest from "../../workbenches/requests/WorkbenchRequest";
import { WorkbenchCollection } from "../../workbenches/collections/WorkbenchCollection";
import WorkbenchResponseTreeItem from "../../views/trees/responses/items/WorkbenchResponseTreeItem";
import { WorkbenchResponse } from "../../workbenches/responses/WorkbenchResponse";

export default class CancelResponseCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.cancelResponse', this.handle.bind(this))
    );
  }
  
  async handle(
    reference: unknown
  ) { 
    let response: WorkbenchResponse;

    if(reference instanceof WorkbenchResponseTreeItem) {
      response = reference.response;
    }
    else {
      throw new Error("Unknown entry point for canceling request.");
    }

    response.abortController.abort();
  };
}
