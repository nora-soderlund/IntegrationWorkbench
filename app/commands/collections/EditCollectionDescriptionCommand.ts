import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchTreeItem";
import { WorkbenchCollection } from "../../workbenches/collections/WorkbenchCollection";
import { randomUUID } from "crypto";
import WorkbenchCollectionTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchCollectionTreeItem";

export default class EditCollectionDescriptionCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.editCollectionDescription', this.handle.bind(this))
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
      
      commands.executeCommand("integrationWorkbench.refreshWorkbenches");
    });
  }
}
