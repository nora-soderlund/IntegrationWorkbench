import { ExtensionContext, commands } from "vscode";
import { Workbench } from "../../entities/workbenches/Workbench";
import WorkbenchRequest from "../../entities/requests/WorkbenchRequest";
import { WorkbenchCollection } from "../../entities/collections/WorkbenchCollection";

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
