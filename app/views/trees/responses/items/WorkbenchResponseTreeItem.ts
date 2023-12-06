import { ThemeColor, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import path from "path";
import { existsSync } from "fs";
import WorkbenchResponse from "../../../../entities/responses/WorkbenchResponse";
import WorkbenchHttpResponse from "../../../../entities/responses/http/WorkbenchHttpResponse";
import WorkbenchEventBridgeRequest from "../../../../entities/requests/aws/WorkbenchEventBridgeRequest";
import WorkbenchEventBridgeResponse from "../../../../entities/responses/aws/WorkbenchEventBridgeResponse";

export default class WorkbenchResponseTreeItem extends TreeItem {
  constructor(
    public readonly response: WorkbenchResponse
  ) {
    super(response.request.name, TreeItemCollapsibleState.None);

    this.tooltip = `${response.request.name} response`;

    this.update();

    this.command = {
      title: "Show response",
      command: "norasoderlund.integrationworkbench.showResponse",
      arguments: [this]
    };
  }

  update() {
    this.contextValue = "response-" + this.response.handler.state.status;
    this.description = this.getDescription();
    this.iconPath = this.getIconPath();

    console.log({ iconPath: this.iconPath });
  }

  getDescription() {
    const now = Date.now();
    const then = this.response.requestedAt.getTime();
    const difference = now - then;

    if(difference < 60 * 1000) {
      return "just now";
    }

    if(difference < 60 * 60 * 1000) {
      return Math.floor(difference / 1000 / 60) + " minutes ago";
    }

    return Math.floor(difference / 1000 / 60 / 60) + " hours ago";
  }

  getIconPath() {
    if(this.response.handler.state.status === "fulfilled") {
      if(this.response instanceof WorkbenchHttpResponse) {
        const iconPath = path.join(__filename, '..', '..', '..', '..', '..', '..', '..', 'resources', 'icons', 'methods', `${this.response.request.data.method}.png`);

        if (existsSync(iconPath)) {
          return iconPath;
        }
  
        return path.join(__filename, '..', '..', '..', '..', '..', '..', '..', 'resources', 'icons', 'HTTP.png');
      }
      else if(this.response instanceof WorkbenchEventBridgeResponse) {
        return path.join(__filename, '..', '..', '..', '..', '..', '..', '..', 'resources', 'icons', 'aws', 'EventBridge.png');
      }

      return new ThemeIcon("search-show-context");
    }

    if(this.response.handler.state.status === "error") {
      return new ThemeIcon("run-errors", new ThemeColor("terminalCommandDecoration.errorBackground"));
    }
    
    return new ThemeIcon("loading~spin", new ThemeColor("progressBar.background"));
  }
}
