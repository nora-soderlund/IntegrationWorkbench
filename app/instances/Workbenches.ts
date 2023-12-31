import { ExtensionContext, commands } from "vscode";
import { Workbench } from "../entities/workbenches/Workbench";
import { existsSync, readFileSync, readdirSync, watch } from "fs";
import path from "path";
import getRootPath from "../utils/GetRootPath";
import WorkbenchRequest from "../entities/requests/WorkbenchRequest";
import { WorkbenchRequestData } from "~interfaces/workbenches/requests/WorkbenchRequestData";
import WorkbenchHttpRequest from "../entities/requests/http/WorkbenchHttpRequest";
import { WorkbenchCollection } from "../entities/collections/WorkbenchCollection";
import WorkbenchEventBridgeRequest from "../entities/requests/aws/WorkbenchEventBridgeRequest";

export default class Workbenches {
  public static workbenches: Workbench[] = [];

  public static register(context: ExtensionContext) {
    this.scanForWorkbenches(context);
  }

  public static getAllRequestsWithWebviews() {
    const requestsWithWebviews: WorkbenchRequest[] = [];
  
    this.workbenches.forEach((workbench) => {
      const requests = workbench.collections.flatMap((collection) => collection.requests).concat(workbench.requests);
  
      requests.forEach((request) => {
        if(request.webview.requestWebviewPanel) {
          requestsWithWebviews.push(request);
        }
      });
    });
  
    return requestsWithWebviews;
  }

  public static scanForWorkbenches(context: ExtensionContext, refresh: boolean = true) {
    this.workbenches.length = 0;
  
    const rootPath = getRootPath();
  
    if(rootPath && existsSync(path.join(rootPath, ".workbench", "workbenches"))) {
      const files = readdirSync(path.join(rootPath, ".workbench", "workbenches"));
  
      for(let file of files) {
        if(existsSync(path.join(rootPath, ".workbench", "workbenches", file, "workbench.json"))) {
          const folder = path.join(rootPath, ".workbench", "workbenches", file);
  
          const content = readFileSync(path.join(folder, "workbench.json"), {
            encoding: "utf-8"
          });
  
          const input = JSON.parse(content);
  
          this.workbenches.push(new Workbench(input, folder));
        }
      }
    }
  
    if(refresh) {
      commands.executeCommand(`norasoderlund.integrationworkbench.refreshWorkbenches`);
    }
  
    return this.workbenches;
  };

  public static createRequestFromData(parent: Workbench | WorkbenchCollection | null, data: WorkbenchRequestData) {
    switch(data.type) {
      case "HTTP":
        return new WorkbenchHttpRequest(parent, data);

      case "EventBridge":
        return new WorkbenchEventBridgeRequest(parent, data);

      default:
        throw new Error("Unknown request type");
    }
  }

  public static getWorkbench(id: string) {
    return this.workbenches.find((workbench) => workbench.id === id) ?? null;
  }

  public static getCollection(id: string) {
    for(let workbench of this.workbenches) {
      const collection = workbench.collections.find((collection) => collection.id === id);

      if(collection) {
        return collection;
      }
    }

    return null;
  }

  public static getRequest(id: string) {
    for(let workbench of this.workbenches) {
      const requests = workbench.requests.concat(workbench.collections.flatMap((collection) => collection.requests));

      const request = requests.find((request) => request.id === id);

      if(request) {
        return request;
      }
    }

    return null;
  }
}
