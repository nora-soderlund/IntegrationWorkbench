import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";

export default class WorkbenchResponsesBookmarkTreeItem extends TreeItem {
  constructor() {
    super("Bookmarks", TreeItemCollapsibleState.None);

    this.tooltip = `Response Bookmarks`;

    this.iconPath = new ThemeIcon("bookmark");
  }
}
