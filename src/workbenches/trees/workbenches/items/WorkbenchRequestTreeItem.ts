import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import WorkbenchTreeItem from "./WorkbenchTreeItem";
import { Workbench } from "../../../Workbench";
import path from "path";
import { existsSync } from "fs";
import WorkbenchRequest from "../../../requests/WorkbenchRequest";
import { WorkbenchCollection } from "../../../collections/WorkbenchCollection";
import WorkbenchHttpRequest from "../../../requests/WorkbenchHttpRequest";

export default class WorkbenchRequestTreeItem extends TreeItem implements WorkbenchTreeItem {
  constructor(
    public readonly workbench: Workbench,
    public readonly request: WorkbenchRequest,
    public readonly collection?: WorkbenchCollection
  ) {
    super(request.name, TreeItemCollapsibleState.None);

    this.tooltip = `${request.name} request`;

    this.command = {
      title: "Open request",
      command: "integrationWorkbench.openRequest",
      arguments: [workbench, request, collection]
    };

    this.setIconPath();
  }

  getIconPath() {
    if (this.request instanceof WorkbenchHttpRequest) {
      if (this.request.data.method) {
        const iconPath = path.join(__filename, '..', '..', 'resources', 'icons', 'methods', `${this.request.data.method}.png`);

        if (existsSync(iconPath)) {
          return {
            light: iconPath,
            dark: iconPath
          };
        }
      }
    }

    return new ThemeIcon("search-show-context");
  }

  setIconPath() {
    this.iconPath = this.getIconPath();
  }
}
