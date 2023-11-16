import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchTreeItem";
import { randomUUID } from "crypto";
import WorkbenchRequestTreeItem from "../../workbenches/trees/workbenches/items/WorkbenchRequestTreeItem";
import WorkbenchRequest from "../../workbenches/requests/WorkbenchRequest";
import Script from "../../scripts/Script";
import ScriptTreeItem from "../../workbenches/trees/scripts/items/ScriptTreeItem";
import Scripts from "../../Scripts";

export default class DeleteScriptCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.deleteScript', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    let script: Script;

    if(reference instanceof ScriptTreeItem) {
      script = reference.script;
    }
    else {
      throw new Error("Unknown entry point for deleting script.");
    }

    script.delete();

    const index = Scripts.loadedScripts.indexOf(script);

    if(index !== -1) {
      Scripts.loadedScripts.splice(index, 1);
    }

    commands.executeCommand("integrationWorkbench.refreshScripts");
  }
}
