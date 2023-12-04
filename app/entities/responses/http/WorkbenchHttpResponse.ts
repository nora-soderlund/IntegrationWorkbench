import WorkbenchResponseTreeItem from "../../../views/trees/responses/items/WorkbenchResponseTreeItem";
import WorkbenchHttpRequest from "../../requests/http/WorkbenchHttpRequest";
import { WorkbenchHttpRequestData } from "~interfaces/workbenches/requests/WorkbenchHttpRequestData";
import HttpFetchHandler from "../../handlers/http/HttpFetchHandler";
import WorkbenchResponse from "../WorkbenchResponse";

export default class WorkbenchHttpResponse implements WorkbenchResponse {
  public treeItem?: WorkbenchResponseTreeItem;
  public request: WorkbenchHttpRequest;
  public handler: HttpFetchHandler;

  public readonly abortController: AbortController = new AbortController();

  constructor(
    public readonly id: string,
    requestData: WorkbenchHttpRequestData,
    public readonly requestedAt: Date
  ) {
    this.request = new WorkbenchHttpRequest(null, requestData);

    this.handler = new HttpFetchHandler(this);
    this.handler.execute(this.abortController);
  }
}
