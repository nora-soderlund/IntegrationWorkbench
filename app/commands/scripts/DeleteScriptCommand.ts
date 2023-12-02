import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import { randomUUID } from "crypto";
import WorkbenchRequestTreeItem from "../../views/trees/workbenches/items/WorkbenchRequestTreeItem";
import WorkbenchRequest from "../../entities/requests/WorkbenchRequest";
import Script from "../../entities/scripts/TypescriptScript";
import ScriptTreeItem from "../../views/trees/scripts/items/ScriptTreeItem";
import Scripts from "../../instances/Scripts";
import Command from "../Command";

export default class DeleteScriptCommand extends Command {
  constructor(context: ExtensionContext) {
    super(context, 'integrationWorkbench.deleteScript');
  }
  
  async handle(reference: unknown) {
    let script: Script;

    if(reference instanceof ScriptTreeItem) {
      script = reference.script;
    }
    else {
      throw new Error("Unknown entry point for deleting script.");
    }

    script.deleteScript();

    const index = Scripts.loadedScripts.indexOf(script);

    if(index !== -1) {
      Scripts.loadedScripts.splice(index, 1);
    }

    commands.executeCommand("integrationWorkbench.refreshScripts");
  }
}
