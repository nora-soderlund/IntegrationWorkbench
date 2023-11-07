import { ThemeIcon, Uri, commands } from "vscode";
import { WorkbenchHttpRequestBodyData, WorkbenchHttpRequestData, WorkbenchHttpRequestHeaderData } from "~interfaces/workbenches/requests/WorkbenchHttpRequestData";
import { Workbench } from "../Workbench";
import { WorkbenchCollection } from "../collections/WorkbenchCollection";
import WorkbenchRequest from "./WorkbenchRequest";
import path from "path";
import { existsSync } from "fs";
import WorkbenchHttpResponse from "../responses/WorkbenchHttpResponse";
import { randomUUID } from "crypto";

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
      data: {
        method: this.data.method,
        url: this.data.url,
        headers: [ ...this.data.headers ],
        body: {
          ...this.data.body
        }
      }
    };
  }
  
  static fromData(parent: Workbench | WorkbenchCollection, data: WorkbenchHttpRequestData) {
    return new WorkbenchHttpRequest(parent, data.id, data.name, data.data);
  }

  send(): void {
    commands.executeCommand("integrationWorkbench.addResponse", new WorkbenchHttpResponse(
      randomUUID(),
      this.getData(),
      new Date()
    ));
  }
  
  setMethod(method: string) {
    this.data.method = method;

    this.treeDataViewItem?.setIconPath();

    commands.executeCommand("integrationWorkbench.refreshWorkbenches");

    this.parent.save();
  }
  
  setUrl(url: string) {
    this.data.url = url;

    this.parent.save();
  }

  setBody(bodyData: WorkbenchHttpRequestBodyData) {
    this.data.body = bodyData;

    this.parent.save();
  }

  setHeaders(headers: WorkbenchHttpRequestHeaderData[]) {
    this.data.headers = headers;

    this.parent.save();
  }
}