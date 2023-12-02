import { existsSync } from "fs";
import path from "path";
import { window, workspace } from "vscode";

export default function getUniqueFolderPath(rootPath: string, folderName: string, extension?: string) {
  let currentPath = path.join(rootPath, folderName);

  if(extension) {
    currentPath += extension;
  }

  if(!existsSync(currentPath)) {
    return currentPath;
  }

  for(let index = 1; index < 20; index++) {
    currentPath = path.join(rootPath, folderName + "-" + index);

    if(extension) {
      currentPath += extension;
    }

    if(!existsSync(currentPath)) {
      return currentPath;
    }
  }

  return null;
}
