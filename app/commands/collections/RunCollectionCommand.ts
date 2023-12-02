import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import { WorkbenchCollection } from "../../entities/collections/WorkbenchCollection";
import { randomUUID } from "crypto";
import WorkbenchCollectionTreeItem from "../../views/trees/workbenches/items/WorkbenchCollectionTreeItem";

export default class RunCollectionCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('norasoderlund.integrationworkbench.runCollection', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    let collection: WorkbenchCollection;

    if(reference instanceof WorkbenchCollectionTreeItem) {
      collection = reference.collection;
    }
    else {
      throw new Error("Unknown entry point for running collection.");
    }
    
    [...collection.requests].reverse().forEach((request) => {
      request.send();
    });
  }
}
