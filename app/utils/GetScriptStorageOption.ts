import { ExtensionContext, Uri, window, workspace } from "vscode";
import { DefaultWorkbenchStorage } from "~interfaces/configuration/DefaultWorkbenchStorage";
import getRootPath from "./GetRootPath";
import { existsSync, mkdirSync } from "fs";
import path from "path";

export default async function getScriptStorageOption(context: ExtensionContext) {
  let workbenchStorage = workspace.getConfiguration("integrationWorkbench").get<DefaultWorkbenchStorage>("defaultWorkbenchStorage");
  let workbenchStoragePath: Uri;

  if(!workbenchStorage || workbenchStorage === "prompt") {
		const options = [
			"Repository script (stored in the repository filesystem)",
			"User script - cannot be used in repository workbenches (stored in the VS Code user storage)"
		];

    const result = await window.showQuickPick(options, {
			canPickMany: false,
			placeHolder: "Select where the script files should be saved:"
		});

    console.log("Result:", result);

    if(!result) {
      return null;
    }

    console.log("Result2:", result);

    switch(result) {
      case "Repository script (stored in the repository filesystem)": {
        workbenchStorage = "repository";

        break;
      }

      case "User script - cannot be used in repository workbenches (stored in the VS Code user storage)": {
        workbenchStorage = "user";

        break;
      }

      default:
        throw new Error("Unexpected result from script storage option was given: " + result);
    }
  }

  if(workbenchStorage === "repository") {
    /*const result = await window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: "Select",
      title: "Where do you want the workbench files to be saved?"
    });*/

    const rootPath = getRootPath();

    if(!rootPath) {
      const result = await window.showSaveDialog({
        defaultUri: Uri.file(path.join(`/.workbench/scripts/`)),
        saveLabel: "Select"
      });

      if(!result) {
        return null;
      }

      workbenchStoragePath = result;
    }
    else {
      workbenchStoragePath = Uri.file(rootPath);
    }
  }
  else if(workbenchStorage === "user") {
    workbenchStoragePath = context.globalStorageUri;
  }
  else {
    throw new Error("Invalid script storage option was given: " + workbenchStorage);
  }

  const workbenchesPath = path.join(workbenchStoragePath.fsPath, ".workbench/", "scripts/");

  try {
    if(!existsSync(workbenchesPath)) {
      mkdirSync(workbenchesPath, {
        recursive: true
      });
    }
  }
  catch(error) {
    window.showErrorMessage("VS Code may not have permissions to create files in the current workspace folder:\n\n" + error);

    return null;
  }

  return {
    location: workbenchStorage,
    path: workbenchesPath
  };
}
