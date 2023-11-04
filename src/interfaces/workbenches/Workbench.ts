import { existsSync, mkdirSync, writeFileSync } from "fs";
import { WorkbenchInput } from "./WorkbenchInput";
import { WorkbenchStorage } from "./WorkbenchStorage";
import { WorkbenchCollection } from "./collections/WorkbenchCollection";
import { window } from "vscode";
import path from "path";

export class Workbench {
    name: string;
    storage: WorkbenchStorage;
    collections: WorkbenchCollection[];

    constructor(input: WorkbenchInput, private readonly path: string) {
        this.name = input.name;
        this.storage = input.storage;
        this.collections = input.collections;
    };

    getMetadataPath() {
        return path.join(this.path, "workbench.json");
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
            writeFileSync(this.getMetadataPath(), JSON.stringify({
                name: this.name,
                storage: this.storage,
                collections: this.collections.map((collection) => {
                    return {
                        name: collection.name,  
                        requests: collection.requests.map((request) => {
                            const clonedRequest = { ...request };

                            delete clonedRequest.webviewPanel;

                            return clonedRequest;
                        }) 
                    };
                })
            }, undefined, 2));
        }
        catch(error) {
            window.showErrorMessage(`Failed to save workbench '${this.name}':\n\n` + error);
        }
    };
};
