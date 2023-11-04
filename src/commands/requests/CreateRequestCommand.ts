import { ExtensionContext, commands, window } from "vscode";
import WorkbenchCollectionTreeItem from "../../trees/items/WorkbenchCollectionTreeItem";
import { randomUUID } from "crypto";

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
        reference.collection.requests.push({
          id: randomUUID(),
          name: value,
          type: null
        });

        reference.workbench.save();

        commands.executeCommand("integrationWorkbench.refreshWorkbenches");
      }
    });
  }
}
