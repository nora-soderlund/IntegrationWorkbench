import { Command, ExtensionContext, commands } from "vscode";
import { Workbench } from "../../workbenches/Workbench";
import { RequestWebviewPanel } from "../../views/webviews/RequestWebviewPanel";
import WorkbenchRequest from "../../workbenches/requests/WorkbenchRequest";
import { WorkbenchCollection } from "../../workbenches/collections/WorkbenchCollection";

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
    request.showWebviewPanel(this.context);
  };
}
