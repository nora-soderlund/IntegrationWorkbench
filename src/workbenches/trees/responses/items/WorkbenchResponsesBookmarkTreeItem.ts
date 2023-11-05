import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import path from "path";
import { existsSync } from "fs";
import { isHttpRequestData } from "../../../../interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import WorkbenchResponse from "../../../responses/WorkbenchHttpResponse";
import WorkbenchHttpRequest from "../../../requests/WorkbenchHttpRequest";

export default class WorkbenchResponsesBookmarkTreeItem extends TreeItem {
  constructor() {
    super("Bookmarks", TreeItemCollapsibleState.None);

    this.tooltip = `Response Bookmarks`;

    this.iconPath = new ThemeIcon("bookmark");
  }
}
