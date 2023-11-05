import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchTreeItem";
import { randomUUID } from "crypto";
import WorkbenchRequestTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchRequestTreeItem";
import WorkbenchRequest from "../../workbenches/requests/WorkbenchRequest";

export default class EditRequestNameCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.editRequestName', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    let request: WorkbenchRequest;

    if(reference instanceof WorkbenchRequestTreeItem) {
      request = reference.request;
    }
    else {
      throw new Error("Unknown entry point for editing request name.");
    }

    window.showInputBox({
      prompt: "Enter a request name",
      value: request.name,
      validateInput(value) {
        if(!value.length) {
          return "You must enter a request name or cancel.";
        }

        return null;
      },
    }).then((value) => {
      if(!value) {
        return;
      }

      request.setName(value);

      commands.executeCommand("integrationWorkbench.refreshWorkbenches");
    });
  }
}
