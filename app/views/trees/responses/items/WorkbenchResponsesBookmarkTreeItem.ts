import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import path from "path";
import { existsSync } from "fs";
import { isHttpRequestData } from "../../../../../src/interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import WorkbenchResponse from "../../../../entities/responses/WorkbenchHttpResponse";
import WorkbenchHttpRequest from "../../../../entities/requests/WorkbenchHttpRequest";

export default class WorkbenchResponsesBookmarkTreeItem extends TreeItem {
  constructor() {
    super("Bookmarks", TreeItemCollapsibleState.None);

    this.tooltip = `Response Bookmarks`;

    this.iconPath = new ThemeIcon("bookmark");
  }
}
