import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import { randomUUID } from "crypto";
import WorkbenchRequestTreeItem from "../../views/trees/workbenches/items/WorkbenchRequestTreeItem";
import WorkbenchRequest from "../../entities/requests/WorkbenchRequest";
import WorkbenchCollectionTreeItem from "../../views/trees/workbenches/items/WorkbenchCollectionTreeItem";
import { WorkbenchCollection } from "../../entities/collections/WorkbenchCollection";

export default class DeleteCollectionCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('norasoderlund.integrationworkbench.deleteCollection', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    let collection: WorkbenchCollection;

    if(reference instanceof WorkbenchCollectionTreeItem) {
      collection = reference.collection;
    }
    else {
      throw new Error("Unknown entry point for deleting collection.");
    }

    collection.parent.removeCollection(collection);
  }
}
