import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchTreeItem";
import { randomUUID } from "crypto";
import WorkbenchRequestTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchRequestTreeItem";
import WorkbenchRequest from "../../workbenches/requests/WorkbenchRequest";
import ScriptTreeItem from "../../workbenches/trees/scripts/items/ScriptTreeItem";

export default class EditScriptNameCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.editScriptName', this.handle.bind(this))
    );
  }
  
  async handle(reference: ScriptTreeItem) {
    window.showInputBox({
      prompt: "Enter a request name",
      value: reference.script.nameWithoutExtension,
      validateInput(value) {
        if(!value.length) {
          return "You must enter a script name or cancel.";
        }

        if(/[^A-Za-z0-9_-]/.test(value)) {
          return "You must only enter a generic file name.";
        }

        return null;
      },
    }).then((value) => {
      if(!value) {
        return;
      }

      reference.script.setName(value);
    });
  }
}
