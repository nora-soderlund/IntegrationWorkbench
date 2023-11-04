import { WorkbenchHttpRequestData } from "../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import WorkbenchRequest from "./WorkbenchRequest";

export default class WorkbenchHttpRequest extends WorkbenchRequest {
  constructor(
    id: string,
    name: string,
    public data: WorkbenchHttpRequestData["data"]
  ) {
    super(id, name);
  }

  getData(): WorkbenchHttpRequestData {
    return {
      id: this.id,
      name: this.name,
      type: "HTTP",
      data: this.data
    };
  }
  
  static fromData(data: WorkbenchHttpRequestData) {
    return new WorkbenchHttpRequest(data.id, data.name, data.data);
  }

  send(): void {
    
  }
}