import WorkbenchResponseTreeItem from "../../../views/trees/responses/items/WorkbenchResponseTreeItem";
import WorkbenchHttpRequest from "../../requests/http/WorkbenchHttpRequest";
import { WorkbenchHttpRequestData } from "~interfaces/workbenches/requests/WorkbenchHttpRequestData";
import HttpFetchHandler from "../../handlers/http/HttpFetchHandler";
import WorkbenchResponse from "../WorkbenchResponse";
import WorkbenchEventBridgeRequest from "../../requests/aws/WorkbenchEventBridgeRequest";
import Handler from "~interfaces/entities/handlers/Handler";
import { WorkbenchEventBridgeRequestData } from "~interfaces/workbenches/requests/aws/WorkbenchEventBridgeRequestData";
import EventBridgeHandler from "../../handlers/aws/EventBridgeHandler";

export default class WorkbenchEventBridgeResponse implements WorkbenchResponse {
  public treeItem?: WorkbenchResponseTreeItem;
  public request: WorkbenchEventBridgeRequest;
  public handler: Handler;

  public readonly abortController: AbortController = new AbortController();

  constructor(
    public readonly id: string,
    requestData: WorkbenchEventBridgeRequestData,
    public readonly requestedAt: Date
  ) {
    this.request = new WorkbenchEventBridgeRequest(null, requestData);

    this.handler = new EventBridgeHandler(this);
    this.handler.execute(this.abortController);
  }
}
