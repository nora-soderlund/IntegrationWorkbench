import { TabInputWebview, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { Workbench } from "../../interfaces/workbenches/Workbench";
import path from "path";

export default class WorkbenchTreeItem extends TreeItem {
    constructor(
      public readonly workbench: Workbench
    ) {
      super(workbench.name, TreeItemCollapsibleState.Expanded);
      
      this.tooltip = `${workbench.name} workbench`;
      this.description = workbench.storage.base;

      this.contextValue = "workbench";
    }
}