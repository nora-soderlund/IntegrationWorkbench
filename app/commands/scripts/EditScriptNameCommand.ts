import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import { randomUUID } from "crypto";
import WorkbenchRequestTreeItem from "../../views/trees/workbenches/items/WorkbenchRequestTreeItem";
import WorkbenchRequest from "../../entities/requests/WorkbenchRequest";
import ScriptTreeItem from "../../views/trees/scripts/items/ScriptTreeItem";
import { existsSync } from "fs";
import path from "path";
import TypescriptScript from "../../entities/scripts/TypescriptScript";
import Scripts from "../../instances/Scripts";
import getRootPath from "../../utils/GetRootPath";
import Command from "../Command";

export default class EditScriptNameCommand extends Command {
  constructor(context: ExtensionContext) {
    super(context, 'integrationWorkbench.editScriptName');
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
