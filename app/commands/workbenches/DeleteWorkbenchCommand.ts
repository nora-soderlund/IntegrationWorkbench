import { ExtensionContext, commands, window } from "vscode";
import { Workbench } from "../../entities/workbenches/Workbench";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import Workbenches from "../../instances/Workbenches";
import Command from "../Command";

export default class DeleteWorkbenchCommand extends Command {
  constructor(context: ExtensionContext) {
    super(context, 'norasoderlund.integrationworkbench.deleteWorkbench');
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

    Workbenches.scanForWorkbenches(this.context, true);
  }
}
