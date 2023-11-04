import { WorkbenchCollectionData } from "../../interfaces/workbenches/collections/WorkbenchCollectionData";
import { WorkbenchRequestData } from "../../interfaces/workbenches/requests/WorkbenchRequestData";
import WorkbenchRequest from "../requests/WorkbenchRequest";

export class WorkbenchCollection {
  name: string;
  requests: WorkbenchRequest[];

  constructor(
    name: string,
    requests: WorkbenchRequestData[]
  ) {
    this.name = name;
    this.requests = requests.map((request) => WorkbenchRequest.fromData(request));
  }

  getData(): WorkbenchCollectionData {
    return {
      name: this.name,
      requests: this.requests.map((request) => request.getData())
    };
  }
}