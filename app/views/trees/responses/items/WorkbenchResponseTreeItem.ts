import { ThemeColor, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import path from "path";
import { existsSync } from "fs";
import { isHttpRequestData } from "../../../../../src/interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import WorkbenchResponse from "../../../../workbenches/responses/WorkbenchHttpResponse";

export default class WorkbenchResponseTreeItem extends TreeItem {
  constructor(
    public readonly response: WorkbenchResponse
  ) {
    super(response.request.name, TreeItemCollapsibleState.None);

    this.tooltip = `${response.request.name} response`;

    this.update();

    this.command = {
      title: "Show response",
      command: "integrationWorkbench.showResponse",
      arguments: [this]
    };
  }

  update() {
    this.contextValue = "response-" + this.response.status;
    this.description = this.getDescription();
    this.iconPath = this.getIconPath();
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
    if(this.response.status === "done") {
      if (isHttpRequestData(this.response.request.data)) {
        const iconPath = path.join(__filename, '..', '..', '..', '..', '..', '..', '..', 'resources', 'icons', 'methods', `${this.response.request.data.method}.png`);

        if (existsSync(iconPath)) {
          return {
            light: iconPath,
            dark: iconPath
          };
        }
      }
      
      return new ThemeIcon("search-show-context");
    }

    if(this.response.status === "failed") {
      return new ThemeIcon("run-errors", new ThemeColor("terminalCommandDecoration.errorBackground"));
    }
    
    return new ThemeIcon("loading~spin", new ThemeColor("progressBar.background"));
  }
}