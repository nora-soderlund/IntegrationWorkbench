import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import { WorkbenchCollection } from "../../entities/collections/WorkbenchCollection";
import { randomUUID } from "crypto";
import WorkbenchCollectionTreeItem from "../../views/trees/workbenches/items/WorkbenchCollectionTreeItem";

export default class EditCollectionDescriptionCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('norasoderlund.integrationworkbench.editCollectionDescription', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    let collection: WorkbenchCollection;

    if(reference instanceof WorkbenchCollectionTreeItem) {
      collection = reference.collection;
    }
    else {
      throw new Error("Unknown entry point for editing collection description.");
    }

    window.showInputBox({
      prompt: "Enter a collection description",
      value: collection.description
    }).then((value) => {
      if(!value) {
        delete collection.description;
      }
      else {
        collection.description = value;
      }

      collection.save();
      
      commands.executeCommand("norasoderlund.integrationworkbench.refreshWorkbenches");
    });
  }
}
