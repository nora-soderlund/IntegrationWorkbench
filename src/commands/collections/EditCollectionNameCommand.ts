import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchTreeItem";
import { WorkbenchCollection } from "../../workbenches/collections/WorkbenchCollection";
import { randomUUID } from "crypto";
import WorkbenchCollectionTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchCollectionTreeItem";

export default class EditCollectionNameCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.editCollectionName', this.handle.bind(this))
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

      commands.executeCommand("integrationWorkbench.refreshWorkbenches");
    });
  }
}
