import { TabInputWebview, ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { Workbench } from "../../interfaces/workbenches/Workbench";

export default class WorkbenchTreeItem extends TreeItem {
    constructor(
      public readonly workbench: Workbench
    ) {
      super(workbench.name, TreeItemCollapsibleState.Expanded);
      
      this.tooltip = `${workbench.name} workbench`;
      
      this.description = workbench.repository;

      this.contextValue = "workbench";
    }
}