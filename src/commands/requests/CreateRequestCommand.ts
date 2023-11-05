import { ExtensionContext, commands, window } from "vscode";
import WorkbenchCollectionTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchCollectionTreeItem";
import { randomUUID } from "crypto";
import WorkbenchRequest from "../../workbenches/requests/WorkbenchRequest";
import WorkbenchHttpRequest from "../../workbenches/requests/WorkbenchHttpRequest";

export default class CreateRequestCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.createRequest', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    window.showInformationMessage('Create request');

    window.showInputBox({
      prompt: "Enter the request name",
      validateInput(value) {
        if(!value.length) {
          return "You must enter a name or cancel.";
        }

        return null;
      },
    }).then((value) => {
      if(!value) {
        return;
      }

      if(reference instanceof WorkbenchCollectionTreeItem) {
        reference.collection.requests.push(
          new WorkbenchHttpRequest(reference.collection, randomUUID(), value, {
            method: "GET",
            url: "https://httpbin.org/get"
          })
        );

        reference.workbench.save();

        commands.executeCommand("integrationWorkbench.refreshWorkbenches");
      }
    });
  }
}
