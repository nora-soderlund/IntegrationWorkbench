import { commands, window } from "vscode";
import { WorkbenchRequestData } from "~interfaces/workbenches/requests/WorkbenchRequestData";
import { WorkbenchHttpResponseData } from "~interfaces/workbenches/responses/WorkbenchHttpResponseData";
import WorkbenchRequest from "../requests/WorkbenchRequest";
import { isHttpRequestApplicationJsonBodyData } from "~interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import { WorkbenchResponseStatus } from "~interfaces/workbenches/responses/WorkbenchResponseStatus";
import WorkbenchResponseTreeItem from "../../views/trees/responses/items/WorkbenchResponseTreeItem";
import WorkbenchHttpRequest from "../requests/WorkbenchHttpRequest";
import Scripts from "../../instances/Scripts";

export default class WorkbenchHttpResponse {
  private response?: Response;
  public error?: string;
  public result?: WorkbenchHttpResponseData["result"];
  public status: WorkbenchResponseStatus = "loading";
  public treeItem?: WorkbenchResponseTreeItem;
  public request: WorkbenchHttpRequest;

  public readonly abortController: AbortController = new AbortController();

  constructor(
    public readonly id: string,
    requestData: WorkbenchRequestData,
    public readonly requestedAt: Date
  ) {
    this.request = WorkbenchHttpRequest.fromData(null, requestData);

    this.request.getParsedUrl(this.abortController).then(async (parsedUrl) => {
      if(!parsedUrl) {
        window.showErrorMessage("No URL was provided in the request.");

        return;
      }

      const headers = new Headers();
      let body: string | undefined;

      switch(this.request.data.authorization.type) {
        case "basic": {
          const username = await Scripts.evaluateUserInput(this.request.data.authorization.username);
          const password = await Scripts.evaluateUserInput(this.request.data.authorization.password);
          
          headers.set("Authorization", `Basic ${btoa(`${username}:${password}`)}`);

          break;
        }

        case "bearer": {
          const token = await Scripts.evaluateUserInput(this.request.data.authorization.token);

          headers.set("Authorization", `Bearer ${token}`);

          break;
        }
      }

      if(isHttpRequestApplicationJsonBodyData(this.request.data.body)) {
        headers.set("Content-Type", "application/json");

        body = this.request.data.body.body;

        for(let header of this.request.data.headers) {
          const value = await Scripts.evaluateUserInput(header);

          headers.set(header.key, value);
        }
      }

      console.log(headers.get("Authorization"));

      fetch(parsedUrl, {
        method: this.request.data.method,
        headers,
        body,
        signal: this.abortController.signal
      })
      .then(this.handleResponse.bind(this))
      .catch(this.handleResponseError.bind(this));
    })
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

    commands.executeCommand("norasoderlund.integrationworkbench.refreshResponses", this);
  }

  async handleResponseError(reason: unknown) {
    this.status = "failed";

    if(reason instanceof Error) {
      this.error = reason.message;
    }
    else if(typeof reason === "string") {
      this.error = reason;
    }

    commands.executeCommand("norasoderlund.integrationworkbench.refreshResponses", this);
  }
}
