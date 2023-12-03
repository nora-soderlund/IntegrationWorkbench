import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import { WorkbenchCollection } from "../../entities/collections/WorkbenchCollection";
import { randomUUID } from "crypto";

export default class CreateCollectionCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('norasoderlund.integrationworkbench.createCollection', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    window.showInputBox({
      prompt: "Enter a collection name",
      validateInput(value) {
        if(!value.length) {
          return "You must enter a collection name or cancel.";
        }

        return null;
      },
    }).then((value) => {
      if(!value) {
        return;
      }

      if(reference instanceof WorkbenchTreeItem) {
        reference.workbench.collections.push(
          new WorkbenchCollection(reference.workbench, randomUUID(), value, undefined, [])
        );

        reference.workbench.save();

        commands.executeCommand("norasoderlund.integrationworkbench.refreshWorkbenches");
      }
    });
  }
}
