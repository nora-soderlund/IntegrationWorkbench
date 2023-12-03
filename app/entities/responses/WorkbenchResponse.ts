import { WorkbenchRequestData } from "~interfaces/workbenches/requests/WorkbenchRequestData";
import { isHttpRequestData } from "~interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import WorkbenchResponseTreeItem from "../../views/trees/responses/items/WorkbenchResponseTreeItem";
import WorkbenchHttpRequest from "../requests/WorkbenchHttpRequest";
import HttpFetchHandler from "../handlers/http/HttpFetchHandler";
import Handler from "~interfaces/entities/handlers/Handler";

export default class WorkbenchResponse {
  public treeItem?: WorkbenchResponseTreeItem;
  public request: WorkbenchHttpRequest;
  public handler: Handler;

  public readonly abortController: AbortController = new AbortController();

  constructor(
    public readonly id: string,
    requestData: WorkbenchRequestData,
    public readonly requestedAt: Date
  ) {
    if(isHttpRequestData(requestData)) {
      this.request = WorkbenchHttpRequest.fromData(null, requestData);
      
      this.handler = new HttpFetchHandler(this);
      this.handler.execute(this.abortController);
    }
    else {
      throw new Error("Unknown request type in the workbench response entity.");
    }
  }
}
