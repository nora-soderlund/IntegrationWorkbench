import WorkbenchResponseTreeItem from "../../views/trees/responses/items/WorkbenchResponseTreeItem";
import Handler from "~interfaces/entities/handlers/Handler";
import WorkbenchRequest from "../requests/WorkbenchRequest";

export default interface WorkbenchResponse {
  id: string;
  treeItem?: WorkbenchResponseTreeItem;
  request: WorkbenchRequest;
  handler: Handler;
  requestedAt: Date;

  readonly abortController: AbortController;
}
