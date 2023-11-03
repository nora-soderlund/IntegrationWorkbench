import { TreeItem, TreeItemCollapsibleState } from "vscode";
import WorkbenchTreeItem from "./WorkbenchTreeItem";
import { Workbench } from "../../interfaces/workbenches/Workbench";
import { WorkbenchRequest } from "../../interfaces/workbenches/requests/WorkbenchRequest";
import { WorkbenchCollection } from "../../interfaces/workbenches/collections/WorkbenchCollection";
import path from "path";

export default class WorkbenchRequestTreeItem extends TreeItem implements WorkbenchTreeItem {
    constructor(
        public readonly workbench: Workbench,
        public readonly request: WorkbenchRequest,
        public readonly collection?: WorkbenchCollection
    ) {
        super(request.name, TreeItemCollapsibleState.None);
        
        this.tooltip = `${request.name} request`;
        
        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', 'resources', 'icons', 'methods', `${request.method}.png`),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'icons', 'methods', `${request.method}.png`)
        };
    }
}
