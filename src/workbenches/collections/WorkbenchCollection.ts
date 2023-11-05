import { commands } from "vscode";
import { WorkbenchCollectionData } from "../../interfaces/workbenches/collections/WorkbenchCollectionData";
import { WorkbenchRequestData } from "../../interfaces/workbenches/requests/WorkbenchRequestData";
import { Workbench } from "../Workbench";
import WorkbenchRequest from "../requests/WorkbenchRequest";

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
    this.requests = requests.map((request) => WorkbenchRequest.fromData(this, request));
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
      workbenchRequest.disposeWebviewPanel();
      
      this.requests.splice(index, 1);
      this.save();

      commands.executeCommand(`integrationWorkbench.refreshWorkbenches`);
    }
  }
}