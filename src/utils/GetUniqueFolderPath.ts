import { existsSync } from "fs";
import path from "path";
import { window, workspace } from "vscode";

export default function getUniqueFolderPath(rootPath: string, folderName: string) {
  let currentPath = path.join(rootPath, folderName);

  if(!existsSync(currentPath)) {
    return currentPath;
  }

  for(let index = 1; index < 20; index++) {
    currentPath = path.join(rootPath, folderName + "-" + index);

    if(!existsSync(currentPath)) {
      return currentPath;
    }
  }

  return null;
}
