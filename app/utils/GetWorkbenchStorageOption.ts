import { ExtensionContext, Uri, window, workspace } from "vscode";
import { existsSync, mkdirSync } from "fs";
import path from "path";

export default async function getWorkbenchStorageOption(rootPath: string) {
  let workbenchStoragePath = Uri.file(rootPath);

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

  return workbenchesPath;
}
