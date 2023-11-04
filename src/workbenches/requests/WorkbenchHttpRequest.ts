import { commands } from "vscode";
import { WorkbenchHttpRequestData } from "../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import WorkbenchRequestTreeItem from "../../trees/items/WorkbenchRequestTreeItem";
import { Workbench } from "../Workbench";
import { WorkbenchCollection } from "../collections/WorkbenchCollection";
import WorkbenchRequest from "./WorkbenchRequest";

export default class WorkbenchHttpRequest extends WorkbenchRequest {
  constructor(
    parent: Workbench | WorkbenchCollection,
    id: string,
    name: string,
    public data: WorkbenchHttpRequestData["data"]
  ) {
    super(parent, id, name);
  }

  getData(): WorkbenchHttpRequestData {
    return {
      id: this.id,
      name: this.name,
      type: "HTTP",
      data: this.data
    };
  }
  
  static fromData(parent: Workbench | WorkbenchCollection, data: WorkbenchHttpRequestData) {
    return new WorkbenchHttpRequest(parent, data.id, data.name, data.data);
  }

  send(): void {
    
  }
  
  setMethod(method: string) {
    this.data.method = method;

    this.treeDataViewItems.forEach((treeDataViewItem) => treeDataViewItem.setIconPath());

    commands.executeCommand("integrationWorkbench.refreshWorkbenches");

    this.parent.save();
  }
}