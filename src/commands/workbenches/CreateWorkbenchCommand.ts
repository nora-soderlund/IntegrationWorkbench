import { ExtensionContext, commands, window } from "vscode";
import getWorkbenchStorageOption from "../../utils/GetWorkbenchStorageOption";
import getUniqueFolderPath from "../../utils/GetUniqueFolderPath";
import getCamelizedString from "../../utils/GetCamelizedString";
import getRootPath from "../../utils/GetRootPath";
import { Workbench } from "../../interfaces/workbenches/Workbench";
import path from "path";
import { workbenches } from "../../Workbenches";

export default class CreateWorkbenchCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.createWorkbench', this.handle.bind(this))
    );
  }
  
  async handle() {
    window.showInformationMessage('Create workbench');

    const name = await window.showInputBox({
      placeHolder: "Enter the name of this workbench:",
  
      validateInput(value) {
        if(!value.length) {
          return "You must enter a name for this workbench!";
        }
  
        return null;
      },
    });
  
    if(!name) {
      return;
    }
  
    const storageOption = await getWorkbenchStorageOption(this.context, name);
  
    if(!storageOption) {
      return;
    }
  
    const uniqueWorkbenchPath = getUniqueFolderPath(storageOption.path, getCamelizedString(name));
  
    if(!uniqueWorkbenchPath) {
      window.showErrorMessage("There is too many workbenches with the same name in this storage option, please choose a different name.");
  
      return null;
    }
  
    const rootPath = getRootPath();
  
    const workbench = new Workbench({
      name,
      storage: {
        location: storageOption.location,
        base: (rootPath)?(path.basename(rootPath)):(undefined)
      },
      collections: []
    }, uniqueWorkbenchPath);
  
    workbench.save();
  
    workbenches.push(workbench);
  
    commands.executeCommand("integrationWorkbench.refreshWorkbenches");
  };
}
