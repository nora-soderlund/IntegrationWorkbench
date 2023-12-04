import { ThemeIcon, TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import WorkbenchTreeItem from "./WorkbenchTreeItem";
import { Workbench } from "../../../../entities/workbenches/Workbench";
import path from "path";
import { existsSync } from "fs";
import WorkbenchRequest from "../../../../entities/requests/WorkbenchRequest";
import { WorkbenchCollection } from "../../../../entities/collections/WorkbenchCollection";
import WorkbenchHttpRequest from "../../../../entities/requests/http/WorkbenchHttpRequest";
import WorkbenchEventBridgeRequest from "../../../../entities/requests/aws/WorkbenchEventBridgeRequest";

export default class WorkbenchRequestTreeItem extends TreeItem implements WorkbenchTreeItem {
  constructor(
    public readonly workbench: Workbench,
    public readonly request: WorkbenchRequest,
    public readonly collection?: Workbench | WorkbenchCollection
  ) {
    super(request.name, TreeItemCollapsibleState.None);

    this.tooltip = `${request.name} request`;
    this.contextValue = "request";

    this.command = {
      title: "Open request",
      command: "norasoderlund.integrationworkbench.openRequest",
      arguments: [workbench, request, collection]
    };

    this.setIconPath();
  }

  getIconPath() {
    if (this.request instanceof WorkbenchHttpRequest) {
      const iconPath = path.join(__filename, '..', '..', '..', '..', '..', '..', '..', 'resources', 'icons', 'methods', `${this.request.data.method}.png`);

      if (existsSync(iconPath)) {
        return Uri.file(iconPath);
      }

      return Uri.file(path.join(__filename, '..', '..', '..', '..', '..', '..', '..', 'resources', 'icons', 'HTTP.png'));
    }
    else if (this.request instanceof WorkbenchEventBridgeRequest) {
      return Uri.file(path.join(__filename, '..', '..', '..', '..', '..', '..', '..', 'resources', 'icons', 'aws', 'EventBridge.svg'));
    }

    return new ThemeIcon("search-show-context");
  }

  setIconPath() {
    this.iconPath = this.getIconPath();

    if(this.iconPath instanceof Uri) {
      this.request.webview.setWebviewPanelIcon(this.iconPath);
    }
  }
}
