import { ExtensionContext, commands } from "vscode";
import { Workbench } from "../../workbenches/Workbench";
import WorkbenchRequest from "../../workbenches/requests/WorkbenchRequest";
import { WorkbenchCollection } from "../../workbenches/collections/WorkbenchCollection";

export default class OpenResponseCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.openResponse', this.handle.bind(this))
    );
  }
  
  async handle(
    request: WorkbenchRequest
  ) {
    
  };
}
