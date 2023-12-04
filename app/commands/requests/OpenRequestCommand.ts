import { Command, ExtensionContext, commands } from "vscode";
import { Workbench } from "../../entities/workbenches/Workbench";
import { RequestWebviewPanel } from "../../views/webviews/RequestWebviewPanel";
import WorkbenchRequest from "../../entities/requests/WorkbenchRequest";
import { WorkbenchCollection } from "../../entities/collections/WorkbenchCollection";

export default class OpenRequestCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('norasoderlund.integrationworkbench.openRequest', this.handle.bind(this))
    );
  }
  
  async handle(
    workbench: Workbench,
    request: WorkbenchRequest,
    collection?: WorkbenchCollection
  ) {
    request.webview.showWebviewPanel(this.context);
  };
}
