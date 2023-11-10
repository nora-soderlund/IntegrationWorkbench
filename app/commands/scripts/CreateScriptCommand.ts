import { ExtensionContext, commands, window } from "vscode";
import getWorkbenchStorageOption from "../../utils/GetWorkbenchStorageOption";
import getUniqueFolderPath from "../../utils/GetUniqueFolderPath";
import getCamelizedString from "../../utils/GetCamelizedString";
import getRootPath from "../../utils/GetRootPath";
import { Workbench } from "../../workbenches/Workbench";
import path from "path";
import { workbenches } from "../../Workbenches";
import { randomUUID } from "crypto";
import getScriptStorageOption from "../../utils/GetScriptStorageOption";
import { existsSync } from "fs";
import Script from "../../scripts/Script";
import Scripts from "../../Scripts";

export default class CreateScriptCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.createScript', this.handle.bind(this))
    );
  }
  
  async handle() {
    const storageOption = await getScriptStorageOption(this.context);
  
    if(!storageOption) {
      return;
    }

    const name = await window.showInputBox({
      placeHolder: "Enter the name of this script:",
  
      validateInput(value) {
        if(!value.length) {
          return "You must enter a name for this script!";
        }

        if(existsSync(path.join(storageOption.path, value))) {
          return "There already exists a script with this name in this folder!";
        }
  
        return null;
      },
    });
  
    if(!name) {
      return;
    }
  
    const script = new Script(path.join(storageOption.path, name + ".js"));
  
    script.save(`
      function getCurrentDate() {
        return new Date().toISOString();
      }
    `);
  
    Scripts.loadedScripts.push(script);

    commands.executeCommand("integrationWorkbench.refreshScripts");
  };
}
