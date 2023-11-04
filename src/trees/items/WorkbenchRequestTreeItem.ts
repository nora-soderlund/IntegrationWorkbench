import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import WorkbenchTreeItem from "./WorkbenchTreeItem";
import { Workbench } from "../../workbenches/Workbench";
import path from "path";
import { existsSync } from "fs";
import WorkbenchRequest from "../../workbenches/requests/WorkbenchRequest";
import { WorkbenchCollection } from "../../workbenches/collections/WorkbenchCollection";
import WorkbenchHttpRequest from "../../workbenches/requests/WorkbenchHttpRequest";

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
