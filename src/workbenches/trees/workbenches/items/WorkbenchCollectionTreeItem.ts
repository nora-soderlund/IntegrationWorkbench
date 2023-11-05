import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import WorkbenchTreeItem from "./WorkbenchTreeItem";
import { Workbench } from "../../../Workbench";
import { WorkbenchCollection } from "../../../collections/WorkbenchCollection";

export default class WorkbenchCollectionTreeItem extends TreeItem implements WorkbenchTreeItem {
    constructor(
        public readonly workbench: Workbench,
        public readonly collection: WorkbenchCollection
    ) {
      super(collection.name, TreeItemCollapsibleState.Expanded);
      this.tooltip = `${collection.name}: ${collection.description}`;
      this.description = collection.description;

      this.contextValue = "collection";
    }
  
    iconPath = new ThemeIcon("folder");
}
