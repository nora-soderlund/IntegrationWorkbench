import { commands } from "vscode";
import { WorkbenchCollectionData } from "~interfaces/workbenches/collections/WorkbenchCollectionData";
import { WorkbenchRequestData } from "~interfaces/workbenches/requests/WorkbenchRequestData";
import { Workbench } from "../workbenches/Workbench";
import WorkbenchRequest from "../requests/WorkbenchRequest";
import { createRequestFromData } from "../../instances/Workbenches";

export class WorkbenchCollection {
  parent: Workbench;
  id: string;
  name: string;
  description?: string;
  requests: WorkbenchRequest[];

  constructor(
    parent: Workbench,
    id: string,
    name: string,
    description: string | undefined,
    requests: WorkbenchRequestData[]
  ) {
    this.parent = parent;
    this.id = id;
    this.name = name;
    this.description = description;
    this.requests = requests.map((request) => createRequestFromData(this, request));
  }

  getData(): WorkbenchCollectionData {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      requests: this.requests.map((request) => request.getData())
    };
  }

  save() {
    this.parent.save();
  }

  removeRequest(workbenchRequest: WorkbenchRequest) {
    const index = this.requests.indexOf(workbenchRequest);

    if(index !== -1) {
      workbenchRequest.webview.disposeWebviewPanel();
      
      this.requests.splice(index, 1);
      this.save();

      commands.executeCommand(`norasoderlund.integrationworkbench.refreshWorkbenches`);
    }
  }
}