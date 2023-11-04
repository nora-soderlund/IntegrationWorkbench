import { workspace } from "vscode";

export default function getRootPath() {
  if(workspace.workspaceFolders?.length) {
    return workspace.workspaceFolders[0].uri.fsPath;
  }

  return undefined;
};
