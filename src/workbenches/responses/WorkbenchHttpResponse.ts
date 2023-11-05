import { commands, window } from "vscode";
import { WorkbenchRequestData } from "../../interfaces/workbenches/requests/WorkbenchRequestData";
import { WorkbenchHttpResponseData } from "../../interfaces/workbenches/responses/WorkbenchHttpResponseData";
import WorkbenchRequest from "../requests/WorkbenchRequest";

export default class WorkbenchHttpResponse {
  private response?: Response;
  public result?: WorkbenchHttpResponseData["result"];

  constructor(
    public readonly id: string,
    public readonly request: WorkbenchRequestData,
    public readonly requestedAt: Date
  ) {
    if(!request.data.url) {
      window.showErrorMessage("No URL was provided in the request.");

      return;
    }

    fetch(request.data.url, {
      method: request.data.method
    }).then(this.handleResponse.bind(this));
  }

  getData(): WorkbenchHttpResponseData {
    return {
      id: this.id,

      request: this.request,
      requestedAt: this.requestedAt.toISOString(),

      result: (this.result) && {
        body: this.result.body,
        headers: this.result.headers
      }
    };
  }

  async handleResponse(response: Response) {
    this.response = response;

    const headers: Record<string, string> = {};
    const body = await response.text();

    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    this.result = {
      body,
      headers
    };

    commands.executeCommand("integrationWorkbench.refreshResponses");
  }
}
