import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../trees/items/WorkbenchTreeItem";

export default class CreateCollectionCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.createCollection', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    window.showInformationMessage('Create collection');

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
        reference.workbench.collections.push({
          name: value,
          requests: []
        });

        reference.workbench.save();

        commands.executeCommand("integrationWorkbench.refreshWorkbenches");
      }
    });
  }
}
