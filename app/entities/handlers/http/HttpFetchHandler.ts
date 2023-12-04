import { commands } from "vscode";
import WorkbenchHttpRequest from "../../requests/http/WorkbenchHttpRequest";
import Handler, { HandlerState } from "~interfaces/entities/handlers/Handler";
import { HttpHandlerFulfilledState } from "../../../../src/interfaces/entities/handlers/http/HttpHandlerFulfilledState";
import WorkbenchResponse from "../../responses/WorkbenchResponse";
import WorkbenchHttpResponse from "../../responses/http/WorkbenchHttpResponse";

export default class HttpFetchHandler implements Handler<HttpHandlerFulfilledState> {
  public state: HandlerState<HttpHandlerFulfilledState> = {
    status: "idle"
  };
  
  constructor(
    private readonly response: WorkbenchHttpResponse
  ) {

  }

  public async execute(abortController: AbortController): Promise<void> {
    try {
      const parsedUrl = await this.response.request.getParsedUrl(abortController);
      const parsedHeaders = await this.response.request.getParsedHeaders(abortController);
      const parsedAuthorization = await this.response.request.getParsedAuthorization(abortController);
      const parsedBody = await this.response.request.getParsedBody(abortController);
  
      parsedAuthorization.headers
  
      fetch(parsedUrl, {
        method: this.response.request.data.method,
        headers: {
          ...parsedBody.headers,
          ...parsedAuthorization.headers,
          ...parsedHeaders.headers
        },
        body: parsedBody.body,
        signal: abortController.signal
      })
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this));
    }
    catch(error) {
      this.handleError(error);
    }
  }

  private async handleResponse(response: Response) {
    const headers: Record<string, string> = {};
    const body = await response.text();

    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    this.state = {
      status: "fulfilled",
      data: {
        body,
        headers,
  
        status: response.status,
        statusText: response.statusText
      }
    };

    commands.executeCommand("norasoderlund.integrationworkbench.refreshResponses", this.response);
  }

  private handleError(error: Error | string | unknown) {
    if(error instanceof Error) {
      this.state = {
        status: "error",
        message: error.message
      };
    }
    else if(typeof error === "string") {
      this.state = {
        status: "error",
        message: error
      };
    }
    else {
      this.state = {
        status: "error",
        message: String(error)
      };
    }

    commands.executeCommand("norasoderlund.integrationworkbench.refreshResponses", this.response);
  }
}