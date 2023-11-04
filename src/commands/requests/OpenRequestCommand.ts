import { Command, ExtensionContext, commands } from "vscode";
import { Workbench } from "../../interfaces/workbenches/Workbench";
import { WorkbenchRequest } from "../../interfaces/workbenches/requests/WorkbenchRequest";
import { WorkbenchCollection } from "../../interfaces/workbenches/collections/WorkbenchCollection";
import { RequestWebviewPanel } from "../../panels/RequestWebviewPanel";

export default class OpenRequestCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.openRequest', this.handle.bind(this))
    );
  }
  
  async handle(
    workbench: Workbench,
    request: WorkbenchRequest,
    collection?: WorkbenchCollection
  ) {
    if(!request.webviewPanel) {
      request.webviewPanel = new RequestWebviewPanel(this.context, workbench, request, collection);
    }
    else {
      request.webviewPanel.reveal();
    }
		
    commands.executeCommand("integrationWorkbench.openResponse", workbench, request, collection);
  };
}
