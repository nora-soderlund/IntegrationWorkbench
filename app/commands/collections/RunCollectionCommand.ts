import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchTreeItem";
import { WorkbenchCollection } from "../../workbenches/collections/WorkbenchCollection";
import { randomUUID } from "crypto";
import WorkbenchCollectionTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchCollectionTreeItem";

export default class RunCollectionCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.runCollection', this.handle.bind(this))
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