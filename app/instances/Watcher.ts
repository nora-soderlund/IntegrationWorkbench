import path from "path";
import { ExtensionContext } from "vscode";
import Workbenches from "./Workbenches";
import getRootPath from "../utils/GetRootPath";
import { existsSync, watch } from "fs";
import Scripts from "./Scripts";
import Environments from "./Environments";

export default class Watcher {
  public static getPath(rootPath: string) {
    return path.join(rootPath, ".workbench")
  };

  public static register(context: ExtensionContext) {
    const rootPath = getRootPath();

    if(!rootPath) {
      return;
    }

    const path = this.getPath(rootPath);

    let currentlyExists = existsSync(path);

    watch(rootPath, () => {
      if(!currentlyExists && existsSync(path)) {
        this.registerWatcher(context, path);

        this.refresh(context);
      }
      else if(currentlyExists && !existsSync(path)) {
        this.refresh(context);
      }
    });

    if(currentlyExists) {
      this.registerWatcher(context, path);
    }
  }

  public static registerWatcher(context: ExtensionContext, filePath: string) {
    const abortController = new AbortController();

    watch(path.join(filePath, "workbenches"), {
      signal: abortController.signal,
      persistent: false
    }, () => {
      Workbenches.scanForWorkbenches(context);
    });

    watch(path.join(filePath, "scripts"), {
      signal: abortController.signal,
      persistent: false
    }, () => {
      Scripts.scanForScripts();
    });

    watch(path.join(filePath, "environments"), {
      signal: abortController.signal,
      persistent: false
    }, () => {
      Environments.scan(context);
    });
  }

  public static refresh(context: ExtensionContext) {
    Workbenches.scanForWorkbenches(context);
    Environments.scan(context);
    Scripts.scanForScripts();
  }
}