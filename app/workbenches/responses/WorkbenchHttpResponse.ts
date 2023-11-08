import { commands, window } from "vscode";
import { WorkbenchRequestData } from "~interfaces/workbenches/requests/WorkbenchRequestData";
import { WorkbenchHttpResponseData } from "~interfaces/workbenches/responses/WorkbenchHttpResponseData";
import WorkbenchRequest from "../requests/WorkbenchRequest";
import { isHttpRequestApplicationJsonBodyData } from "~interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import { WorkbenchResponseStatus } from "~interfaces/workbenches/responses/WorkbenchResponseStatus";
import WorkbenchResponseTreeItem from "../trees/responses/items/WorkbenchResponseTreeItem";
import WorkbenchHttpRequest from "../requests/WorkbenchHttpRequest";

export default class WorkbenchHttpResponse {
  private response?: Response;
  public error?: string;
  public result?: WorkbenchHttpResponseData["result"];
  public status: WorkbenchResponseStatus = "loading";
  public treeItem?: WorkbenchResponseTreeItem;
  public request: WorkbenchHttpRequest;

  constructor(
    public readonly id: string,
    requestData: WorkbenchRequestData,
    public readonly requestedAt: Date
  ) {
    this.request = WorkbenchHttpRequest.fromData(null, requestData);

    const parsedUrl = this.request.getParsedUrl();

    if(!parsedUrl) {
      window.showErrorMessage("No URL was provided in the request.");

      return;
    }

    const headers = new Headers();
    let body: string | undefined;

    switch(this.request.data.authorization.type) {
      case "basic": {
        headers.set("Authorization", `Basic ${btoa(`${this.request.data.authorization.username}:${this.request.data.authorization.password}`)}`);

        break;
      }

      case "bearer": {
        headers.set("Authorization", `Bearer ${this.request.data.authorization.token}`);

        break;
      }
    }

    if(isHttpRequestApplicationJsonBodyData(this.request.data.body)) {
      headers.set("Content-Type", "application/json");

      body = this.request.data.body.body;

      this.request.data.headers.forEach((header) => {
        headers.set(header.name, header.value);
      });
    }

    console.log(headers.get("Authorization"));

    fetch(parsedUrl, {
      method: this.request.data.method,
      headers,
      body
    })
    .then(this.handleResponse.bind(this))
    .catch(this.handleResponseError.bind(this));
  }

  getData(): WorkbenchHttpResponseData {
    return {
      id: this.id,

      status: this.status,

      request: this.request.getData(),
      requestedAt: this.requestedAt.toISOString(),

      error: this.error,

      result: (this.response && this.result) && {
        body: this.result.body,
        headers: this.result.headers,

        status: this.response.status,
        statusText: this.response.statusText
      }
    };
  }

  async handleResponse(response: Response) {
    this.status = "done";
    this.response = response;

    const headers: Record<string, string> = {};
    const body = await response.text();

    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    this.result = {
      body,
      headers,

      status: response.status,
      statusText: response.statusText
    };

    commands.executeCommand("integrationWorkbench.refreshResponses", this);
  }

  async handleResponseError(reason: unknown) {
    this.status = "failed";

    if(reason instanceof Error) {
      this.error = reason.message;
    }
    else if(typeof reason === "string") {
      this.error = reason;
    }

    commands.executeCommand("integrationWorkbench.refreshResponses", this);
  }
}
