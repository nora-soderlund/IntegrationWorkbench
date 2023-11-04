import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import WorkbenchTreeItem from "./WorkbenchTreeItem";
import { Workbench } from "../../interfaces/workbenches/Workbench";
import { WorkbenchRequest } from "../../interfaces/workbenches/requests/WorkbenchRequest";
import { WorkbenchCollection } from "../../interfaces/workbenches/collections/WorkbenchCollection";
import path from "path";
import { existsSync } from "fs";

export default class WorkbenchRequestTreeItem extends TreeItem implements WorkbenchTreeItem {
    constructor(
        public readonly workbench: Workbench,
        public readonly request: WorkbenchRequest,
        public readonly collection?: WorkbenchCollection
    ) {
        super(request.name, TreeItemCollapsibleState.None);
        
        this.tooltip = `${request.name} request`;
     
        this.iconPath = this.getIconPath();

        this.command = {
            title: "Open request",
            command: "integrationWorkbench.openRequest",
            arguments: [ workbench, request, collection ]
        };
    }

    getIconPath() {
        if(this.request.type === "HTTP") {
            const iconPath = path.join(__filename, '..', '..', '..', '..', 'resources', 'icons', 'methods', `${this.request.details.method}.png`);

            if(existsSync(iconPath)) {
                return {
                    light: iconPath,
                    dark: iconPath
                };
            }
        }

        return new ThemeIcon("search-show-context");
    }
}
