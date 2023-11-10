import { ExtensionContext, commands } from "vscode";
import { Workbench } from "./workbenches/Workbench";
import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";
import getRootPath from "./utils/GetRootPath";
import WorkbenchRequest from "./workbenches/requests/WorkbenchRequest";

export const workbenches: Workbench[] = [];

export function getAllRequestsWithWebviews() {
  const requestsWithWebviews: WorkbenchRequest[] = [];

  workbenches.forEach((workbench) => {
    const requests = workbench.collections.flatMap((collection) => collection.requests).concat(workbench.requests);

    requests.forEach((request) => {
      if(request.requestWebviewPanel) {
        requestsWithWebviews.push(request);
      }
    });
  });

  return requestsWithWebviews;
}

export function scanForWorkbenches(context: ExtensionContext, refresh: boolean = true) {
  const folders: string[] = [];

  const rootPaths = [
    context.globalStorageUri.fsPath,
    getRootPath()
  ];

  for(let rootPath of rootPaths) {
    if(!rootPath) {
      continue;
    }

    if(!existsSync(path.join(rootPath, ".workbench", "workbenches"))) {
      continue;
    }

    const files = readdirSync(path.join(rootPath, ".workbench", "workbenches"));

    for(let file of files) {
      if(existsSync(path.join(rootPath, ".workbench", "workbenches", file, "workbench.json"))) {
        folders.push(path.join(rootPath, ".workbench", "workbenches", file));
      }
    }
  }

  workbenches.length = 0;
  workbenches.push(...folders.map((folder) => {
    const content = readFileSync(path.join(folder, "workbench.json"), {
      encoding: "utf-8"
    });

    const input = JSON.parse(content);

    return new Workbench(input, folder);
  }));

  if(refresh) {
    commands.executeCommand(`integrationWorkbench.refreshWorkbenches`);
  }

  return workbenches;
};
