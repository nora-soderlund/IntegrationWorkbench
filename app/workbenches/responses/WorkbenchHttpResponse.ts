import { commands, window } from "vscode";
import { WorkbenchRequestData } from "~interfaces/workbenches/requests/WorkbenchRequestData";
import { WorkbenchHttpResponseData } from "~interfaces/workbenches/responses/WorkbenchHttpResponseData";
import WorkbenchRequest from "../requests/WorkbenchRequest";
import { isHttpRequestApplicationJsonBodyData } from "~interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import { WorkbenchResponseStatus } from "~interfaces/workbenches/responses/WorkbenchResponseStatus";
import WorkbenchResponseTreeItem from "../trees/responses/items/WorkbenchResponseTreeItem";

export default class WorkbenchHttpResponse {
  private response?: Response;
  public error?: string;
  public result?: WorkbenchHttpResponseData["result"];
  public status: WorkbenchResponseStatus = "loading";
  public treeItem?: WorkbenchResponseTreeItem;

  constructor(
    public readonly id: string,
    public readonly request: WorkbenchRequestData,
    public readonly requestedAt: Date
  ) {
    if(!request.data.url) {
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
    }

    if(isHttpRequestApplicationJsonBodyData(this.request.data.body)) {
      headers.set("Content-Type", "application/json");

      body = this.request.data.body.body;

      this.request.data.headers.forEach((header) => {
        headers.set(header.name, header.value);
      });
    }

    console.log(headers.get("Authorization"));

    fetch(this.getParsedUrl(request.data.url), {
      method: request.data.method,
      headers,
      body
    })
    .then(this.handleResponse.bind(this))
    .catch(this.handleResponseError.bind(this));
  }

  getParsedUrl(url: string) {
    return url.replace(/\{(.+?)\}/g, (_match, key) => {
      const parameter = this.request.data.parameters.find((parameter) => parameter.name === key);

      if(parameter) {
        return parameter.value;
      }

      return '{' + key + '}';
    });
  }

  getData(): WorkbenchHttpResponseData {
    return {
      id: this.id,

      status: this.status,

      request: this.request,
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
