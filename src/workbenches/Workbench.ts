import { existsSync, mkdirSync, writeFileSync } from "fs";
import { WorkbenchStorage } from "../interfaces/workbenches/WorkbenchStorage";
import { window } from "vscode";
import path from "path";
import { WorkbenchData } from "../interfaces/workbenches/WorkbenchData";
import { WorkbenchCollection } from "./collections/WorkbenchCollection";

export class Workbench {
    name: string;
    storage: WorkbenchStorage;
    collections: WorkbenchCollection[];

    constructor(data: WorkbenchData, private readonly path: string) {
        this.name = data.name;
        this.storage = data.storage;

        this.collections = data.collections.map((collection) => new WorkbenchCollection(collection.name, collection.requests));
    };

    getMetadataPath() {
        return path.join(this.path, "workbench.json");
    }

    getData(): WorkbenchData {
        return {
            name: this.name,
            storage: this.storage,
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
};
