import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import { WorkbenchCollection } from "../../entities/collections/WorkbenchCollection";
import { randomUUID } from "crypto";
import WorkbenchCollectionTreeItem from "../../views/trees/workbenches/items/WorkbenchCollectionTreeItem";

export default class EditCollectionNameCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('norasoderlund.integrationworkbench.editCollectionName', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    let collection: WorkbenchCollection;

    if(reference instanceof WorkbenchCollectionTreeItem) {
      collection = reference.collection;
    }
    else {
      throw new Error("Unknown entry point for editing collection name.");
    }

    window.showInputBox({
      prompt: "Enter a collection name",
      value: collection.name,
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

      collection.name = value;
      collection.save();

      commands.executeCommand("norasoderlund.integrationworkbench.refreshWorkbenches");
    });
  }
}
