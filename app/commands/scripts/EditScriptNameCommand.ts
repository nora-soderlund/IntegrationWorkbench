import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import { randomUUID } from "crypto";
import WorkbenchRequestTreeItem from "../../views/trees/workbenches/items/WorkbenchRequestTreeItem";
import WorkbenchRequest from "../../workbenches/requests/WorkbenchRequest";
import ScriptTreeItem from "../../views/trees/scripts/items/ScriptTreeItem";
import { existsSync } from "fs";
import path from "path";
import TypescriptScript from "../../entities/TypescriptScript";
import Scripts from "../../Scripts";
import getRootPath from "../../utils/GetRootPath";

export default class EditScriptNameCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.editScriptName', this.handle.bind(this))
    );
  }
  
  async handle(reference: ScriptTreeItem) {
    const rootPath = getRootPath();

    if(!rootPath) {
      window.showErrorMessage("You must be in a workspace to create a script!");

      return;
    }

    const scriptsPath = Scripts.getScriptsPath(rootPath);

    window.showInputBox({
      prompt: "Enter a request name",
      value: reference.script.getName(),
      validateInput(value) {
        if(!value.length) {
          return "You must enter a script name or cancel.";
        }

        if(reference.script instanceof TypescriptScript) {
          if(!value.endsWith('.ts')) {
            return "Script name must end with '.ts' for TypeScript files!";
          }
        }

        const nameValue = value.substring(0, value.length - 3);

        if(/[^A-Za-z0-9_-]/.test(nameValue)) {
          return "You must only enter a generic file name.";
        }

        if(value !== reference.script.getName()) {
          if(existsSync(path.join(scriptsPath, value))) {
            return "There already exists a script with this name in this folder!";
          }
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
