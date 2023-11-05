import { existsSync, mkdirSync, writeFileSync } from "fs";
import { WorkbenchStorage } from "../interfaces/workbenches/WorkbenchStorage";
import { commands, window } from "vscode";
import path from "path";
import { WorkbenchData } from "../interfaces/workbenches/WorkbenchData";
import { WorkbenchCollection } from "./collections/WorkbenchCollection";
import WorkbenchRequest from "./requests/WorkbenchRequest";

export class Workbench {
    id: string;
    name: string;
    storage: WorkbenchStorage;
    collections: WorkbenchCollection[];
    requests: WorkbenchRequest[];

    constructor(data: WorkbenchData, private readonly path: string) {
        this.id = data.id;
        this.name = data.name;
        this.storage = data.storage;

        this.requests = data.requests.map((request) => WorkbenchRequest.fromData(this, request));
        this.collections = data.collections.map((collection) => new WorkbenchCollection(this, collection.id, collection.name, collection.description, collection.requests));
    };

    getMetadataPath() {
        return path.join(this.path, "workbench.json");
    }

    getData(): WorkbenchData {
        return {
            id: this.id,
            name: this.name,
            storage: this.storage,
            requests: this.requests.map((request) => request.getData()),
            collections: this.collections.map((collection) => collection.getData())
        };
    }

    save() {
        try {
            if(!existsSync(this.path)) {
                mkdirSync(this.path, {
                    recursive: true
                });
            }
        }
        catch(error) {
            window.showErrorMessage("VS Code may not have permissions to create files in the current workspace folder:\n\n" + error);
        }

        try {
            writeFileSync(this.getMetadataPath(), JSON.stringify(this.getData(), undefined, 2));
        }
        catch(error) {
            window.showErrorMessage(`Failed to save workbench '${this.name}':\n\n` + error);
        }
    };

    removeRequest(workbenchRequest: WorkbenchRequest) {
      const index = this.requests.indexOf(workbenchRequest);
  
      if(index !== -1) {
        this.requests.splice(index, 1);
        this.save();
  
        commands.executeCommand(`integrationWorkbench.refreshWorkbenches`);
      }
    }
};
