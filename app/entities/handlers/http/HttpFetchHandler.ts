import { commands } from "vscode";
import WorkbenchHttpRequest from "../../requests/http/WorkbenchHttpRequest";
import Handler, { HandlerState } from "~interfaces/entities/handlers/Handler";
import { HttpHandlerFulfilledState } from "../../../../src/interfaces/entities/handlers/http/HttpHandlerFulfilledState";
import WorkbenchResponse from "../../responses/WorkbenchResponse";
import WorkbenchHttpResponse from "../../responses/http/WorkbenchHttpResponse";
import { HttpHandlerState } from "~interfaces/entities/handlers/http/HttpHandlerState";

export default class HttpFetchHandler implements Handler<HttpHandlerFulfilledState> {
  public state: HttpHandlerState = {
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

      const headers = Object. fromEntries(Object.entries({
        ...parsedBody.headers,
        ...parsedAuthorization.headers,
        ...parsedHeaders.headers
      }).filter(([ key, value ]) => key.length && value.length));

      this.state = {
        status: "started",
        request: {
          method: this.response.request.data.method,
          url: parsedUrl,
          headers,
          body: parsedBody.body
        }
      };
  
      fetch(parsedUrl, {
        method: this.response.request.data.method,
        headers,
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
      request: this.state.request,
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
        request: this.state.request,
        message: error.message
      };
    }
    else if(typeof error === "string") {
      this.state = {
        status: "error",
        request: this.state.request,
        message: error
      };
    }
    else {
      this.state = {
        status: "error",
        request: this.state.request,
        message: String(error)
      };
    }

    commands.executeCommand("norasoderlund.integrationworkbench.refreshResponses", this.response);
  }
}