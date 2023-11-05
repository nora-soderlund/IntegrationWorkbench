import { ThemeColor, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import path from "path";
import { existsSync } from "fs";
import { isHttpRequestData } from "../../../../interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import WorkbenchResponse from "../../../responses/WorkbenchHttpResponse";
import WorkbenchHttpRequest from "../../../requests/WorkbenchHttpRequest";

export default class WorkbenchResponseTreeItem extends TreeItem {
  constructor(
    public readonly response: WorkbenchResponse
  ) {
    super(response.request.name, TreeItemCollapsibleState.None);

    this.contextValue = (response.result)?("response"):("responseLoading");

    this.tooltip = `${response.request.name} response`;
    this.description = `${response.requestedAt.getHours()}:${response.requestedAt.getMinutes().toString().padStart(2, '0')}`;

    this.setIconPath();
    this.updateDescription();

    this.command = {
      title: "Show response",
      command: "integrationWorkbench.showResponse",
      arguments: [response]
    };
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

  updateDescription() {
    this.description = this.getDescription();
  }

  getIconPath() {
    if(this.response.result) {
      if (isHttpRequestData(this.response.request)) {
        const iconPath = path.join(__filename, '..', '..', 'resources', 'icons', 'methods', `${this.response.request.data.method}.png`);

        if (existsSync(iconPath)) {
          return {
            light: iconPath,
            dark: iconPath
          };
        }
      }
      
      return new ThemeIcon("search-show-context");
    }
    
    return new ThemeIcon("loading~spin", new ThemeColor("progressBar.background"));
  }

  setIconPath() {
    this.iconPath = this.getIconPath();
  }
}
