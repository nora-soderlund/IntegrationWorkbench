import { ExtensionContext, commands, window } from "vscode";
import path from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import Script from "../../entities/scripts/TypescriptScript";
import Scripts from "../../instances/Scripts";
import getRootPath from "../../utils/GetRootPath";
import OpenScriptCommand from "./OpenScriptCommand";
import Command from "../Command";

export default class CreateScriptCommand extends Command {
  constructor(context: ExtensionContext) {
    super(context, 'norasoderlund.integrationworkbench.createScript');
  }
  
  async handle() {
    const rootPath = getRootPath();

    if(!rootPath) {
      window.showErrorMessage("You must be in a workspace to create a script!");

      return;
    }
  
    const scriptsPath = Scripts.createScriptsFolder(rootPath);

    const scriptType = await window.showQuickPick([
      "TypeScript"
    ], {
      canPickMany: false,
      title: "Select the type of script to create:"
    });

    if(!scriptType) {
      return;
    }

    const name = await window.showInputBox({
      placeHolder: "Enter the name of this script:",
  
      validateInput(value) {
        if(!value.length) {
          return "You must enter a name for this script!";
        }

        if(scriptType === "TypeScript") {
          if(!value.endsWith('.ts')) {
            return "Script name must end with '.ts' for TypeScript files!";
          }
        }

        const nameValue = value.substring(0, value.length - 3);

        if(/[^A-Za-z0-9_-]/.test(nameValue)) {
          return "You must only enter a generic file name.";
        }

        if(existsSync(path.join(scriptsPath, value))) {
          return "There already exists a script with this name in this folder!";
        }
  
        return null;
      },
    });
  
    if(!name) {
      return;
    }

    const filePath = path.join(scriptsPath, name);

    const script = new Script(filePath);

    script.saveScript(`export async function ${script.getNameWithoutExtension()}() {\n  // Your code goes here...\n\n  return "Hello world!";\n}\n`);

    Scripts.loadedScripts.push(script);

    commands.executeCommand("norasoderlund.integrationworkbench.refreshScripts");
    commands.executeCommand("norasoderlund.integrationworkbench.openScript", script);
  };
}
