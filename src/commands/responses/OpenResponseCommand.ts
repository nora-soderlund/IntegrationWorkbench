import { Command, ExtensionContext, commands } from "vscode";
import { Workbench } from "../../interfaces/workbenches/Workbench";
import { WorkbenchRequest } from "../../interfaces/workbenches/requests/WorkbenchRequest";
import { WorkbenchCollection } from "../../interfaces/workbenches/collections/WorkbenchCollection";
import { RequestWebviewPanel } from "../../panels/RequestWebviewPanel";

export default class OpenResponseCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.openResponse', this.handle.bind(this))
    );
  }
  
  async handle(
    workbench: Workbench,
    request: WorkbenchRequest,
    collection?: WorkbenchCollection
  ) {
    
  };
}
