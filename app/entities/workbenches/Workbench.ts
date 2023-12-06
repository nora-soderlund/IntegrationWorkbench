import { existsSync, mkdirSync, rmSync, rmdirSync, writeFileSync } from "fs";
import { commands, window } from "vscode";
import path from "path";
import { WorkbenchData } from "../../../src/interfaces/workbenches/WorkbenchData";
import { WorkbenchCollection } from "../collections/WorkbenchCollection";
import WorkbenchRequest from "../requests/WorkbenchRequest";
import Workbenches from "../../instances/Workbenches";

export class Workbench {
  id: string;
  name: string;
  description?: string;
  collections: WorkbenchCollection[];
  requests: WorkbenchRequest[];

  constructor(data: WorkbenchData, public path: string) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;

    this.requests = data.requests.map((request) => Workbenches.createRequestFromData(this, request));
    this.collections = data.collections.map((collection) => new WorkbenchCollection(this, collection.id, collection.name, collection.description, collection.requests));
  };

  getMetadataPath() {
    return path.join(this.path, "workbench.json");
  }

  getData(): WorkbenchData {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      requests: this.requests.map((request) => request.getData()),
      collections: this.collections.map((collection) => collection.getData())
    };
  }

  save() {
    try {
      if (!existsSync(this.path)) {
        mkdirSync(this.path, {
          recursive: true
        });
      }
    }
    catch (error) {
      window.showErrorMessage("VS Code may not have permissions to create files in the current workspace folder:\n\n" + error);
    }

    try {
      writeFileSync(this.getMetadataPath(), JSON.stringify(this.getData(), undefined, 2));
    }
    catch (error) {
      window.showErrorMessage(`Failed to save workbench '${this.name}':\n\n` + error);
    }
  };

  delete() {
    try {
      rmSync(this.path, {
        recursive: true
      });
    }
    catch (error) {
      window.showErrorMessage(`Failed to delete workbench '${this.name}':\n\n` + error);
    }
  };

  removeCollection(workbenchCollection: WorkbenchCollection) {
    const index = this.collections.indexOf(workbenchCollection);

    if (index !== -1) {
      workbenchCollection.parent.requests.push(...workbenchCollection.requests);

      this.collections.splice(index, 1);
      this.save();

      commands.executeCommand(`norasoderlund.integrationworkbench.refreshWorkbenches`);
    }
  }

  removeRequest(workbenchRequest: WorkbenchRequest) {
    const index = this.requests.indexOf(workbenchRequest);

    if (index !== -1) {
      workbenchRequest.webview.disposeWebviewPanel();

      this.requests.splice(index, 1);
      this.save();

      commands.executeCommand(`norasoderlund.integrationworkbench.refreshWorkbenches`);
    }
  }
};
