import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import WorkbenchTreeItem from "./WorkbenchTreeItem";
import { Workbench } from "../../interfaces/workbenches/Workbench";
import { WorkbenchCollection } from "../../interfaces/workbenches/collections/WorkbenchCollection";

export default class WorkbenchCollectionTreeItem extends TreeItem implements WorkbenchTreeItem {
    constructor(
        public readonly workbench: Workbench,
        public readonly collection: WorkbenchCollection
    ) {
      super(collection.name, TreeItemCollapsibleState.Expanded);
      this.tooltip = `${collection.name} collection`;

      this.contextValue = "collection";
    }
  
    iconPath = new ThemeIcon("folder");
}
