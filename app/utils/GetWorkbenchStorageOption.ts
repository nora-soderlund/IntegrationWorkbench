import { ExtensionContext, Uri, window, workspace } from "vscode";
import { DefaultWorkbenchStorage } from "~interfaces/configuration/DefaultWorkbenchStorage";
import getRootPath from "./GetRootPath";
import { existsSync, mkdirSync } from "fs";
import path from "path";

export default async function getWorkbenchStorageOption(context: ExtensionContext, name: string) {
  let workbenchStorage = workspace.getConfiguration("integrationWorkbench").get<DefaultWorkbenchStorage>("defaultWorkbenchStorage");
  let workbenchStoragePath: Uri;

  if(!workbenchStorage || workbenchStorage === "prompt") {
		const options = [
			"Repository workbench (stored in the repository filesystem)",
			"User workbench (stored in the VS Code user storage)"
		];

    const result = await window.showQuickPick(options, {
			canPickMany: false,
			placeHolder: "Select where the workbench files should be saved:"
		});

    if(!result) {
      return null;
    }

    switch(result) {
      case "Repository workbench (stored in the repository filesystem)": {
        workbenchStorage = "repository";

        break;
      }

      case "User workbench (stored in the VS Code user storage)": {
        workbenchStorage = "user";

        break;
      }

      default:
        throw new Error("Unexpected result from workbench storage option was given: " + result);
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
        defaultUri: Uri.file(path.join(`/.workbench/workbenches/${name.toLocaleLowerCase()}/`)),
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
    throw new Error("Invalid workbench storage option was given: " + workbenchStorage);
  }

  const workbenchesPath = path.join(workbenchStoragePath.fsPath, ".workbench/", "workbenches/");

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
