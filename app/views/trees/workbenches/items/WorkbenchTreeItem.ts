import { TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import { Workbench } from "../../../../entities/workbenches/Workbench";
import path from "path";

export default class WorkbenchTreeItem extends TreeItem {
    constructor(
      public readonly workbench: Workbench
    ) {
      super(workbench.name, TreeItemCollapsibleState.Expanded);
      
      this.tooltip = `${workbench.name} workbench`;

      this.description = workbench.description;

      this.contextValue = "workbench";
    }
}