import { WorkbenchCollectionData } from "../../interfaces/workbenches/collections/WorkbenchCollectionData";
import { WorkbenchRequestData } from "../../interfaces/workbenches/requests/WorkbenchRequestData";
import { Workbench } from "../Workbench";
import WorkbenchRequest from "../requests/WorkbenchRequest";

export class WorkbenchCollection {
  parent: Workbench;
  id: string;
  name: string;
  requests: WorkbenchRequest[];

  constructor(
    parent: Workbench,
    id: string,
    name: string,
    requests: WorkbenchRequestData[]
  ) {
    this.parent = parent;
    this.id = id;
    this.name = name;
    this.requests = requests.map((request) => WorkbenchRequest.fromData(this, request));
  }

  getData(): WorkbenchCollectionData {
    return {
      id: this.id,
      name: this.name,
      requests: this.requests.map((request) => request.getData())
    };
  }

  save() {
    this.parent.save();
  }
}