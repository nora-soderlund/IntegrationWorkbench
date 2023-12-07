import { commands } from "vscode";
import { WorkbenchHttpAuthorization, WorkbenchHttpRequestBodyData, WorkbenchHttpRequestData, WorkbenchHttpRequestHeaderData } from "~interfaces/workbenches/requests/WorkbenchHttpRequestData";
import { Workbench } from "../../workbenches/Workbench";
import { WorkbenchCollection } from "../../collections/WorkbenchCollection";
import WorkbenchRequest from "../WorkbenchRequest";
import { randomUUID } from "crypto";
import Scripts from "../../../instances/Scripts";
import { UserInput } from "~interfaces/UserInput";
import Environments from "../../../instances/Environments";
import { isHttpRequestApplicationJsonBodyData } from "~interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import WorkbenchResponse from "../../responses/WorkbenchResponse";
import RequestWebview from "../RequestWebview";
import WorkbenchHttpResponse from "../../responses/http/WorkbenchHttpResponse";

export default class WorkbenchHttpRequest implements WorkbenchRequest {
  public readonly id: string;
  public name: string;
  public data: WorkbenchHttpRequestData["data"];
  public webview: RequestWebview;

  constructor(
    public readonly parent: Workbench | WorkbenchCollection | null,
    data: WorkbenchHttpRequestData
  ) {
    this.id = data.id;
    this.name = data.name;
    this.data = data.data;
    this.webview = new RequestWebview(this);
  }

  getData(): WorkbenchHttpRequestData {
    return {
      id: this.id,
      name: this.name,
      type: "HTTP",
      data: {
        authorization: {
          ...this.data.authorization
        },
        method: this.data.method,
        url: this.data.url,
        headers: [ ...this.data.headers ],
        headersAutoRefresh: this.data.headersAutoRefresh,
        parameters: [ ...this.data.parameters ],
        parametersAutoRefresh: this.data.parametersAutoRefresh,
        body: {
          ...this.data.body
        }
      }
    };
  }

  async getParsedAuthorization(abortController: AbortController) {
    return new Promise<{ headers: Record<string, string> }>(async (resolve, reject) => {
      try {
        const headers: Record<string, string> = {};

        const abortListener = () => reject("Aborted.");
        abortController.signal.addEventListener("abort", abortListener);

        switch(this.data.authorization.type) {
          case "basic": {
            const username = await Scripts.evaluateUserInput(this.data.authorization.username);
            const password = await Scripts.evaluateUserInput(this.data.authorization.password);
            
            headers["Authorization"] = `Basic ${btoa(`${username}:${password}`)}`;

            break;
          }

          case "bearer": {
            const token = await Scripts.evaluateUserInput(this.data.authorization.token);

            headers["Authorization"] = `Bearer ${token}`;

            break;
          }
        }

        abortController.signal.removeEventListener("abort", abortListener);

        resolve({ headers });
      }
      catch(error) {
        reject(error);
      }
    });
  }

  async getParsedBody(abortController: AbortController) {
    return new Promise<{ headers: Record<string, string>, body: string | undefined }>(async (resolve, reject) => {
      const headers: Record<string, string> = {};
      let body: string | undefined;

      const abortListener = () => reject("Aborted.");
      abortController.signal.addEventListener("abort", abortListener);

      if(isHttpRequestApplicationJsonBodyData(this.data.body)) {
        headers["Content-Type"] = "application/json";

        body = this.data.body.body;

        for(let header of this.data.headers) {
          const value = await Scripts.evaluateUserInput(header);

          headers[header.key] = value;
        }
      }

      abortController.signal.removeEventListener("abort", abortListener);

      resolve({ headers, body });
    });
  }

  async getParsedUrl(abortController: AbortController) {
    return new Promise<string>(async (resolve, reject) => {
      if(!this.data.url) {
        reject("Request URL is falsey.");

        return;
      }

      const abortListener = () => reject("Aborted.");
      abortController.signal.addEventListener("abort", abortListener);

      const keys: string[] = [];

      this.data.url.replace(/\{(.+?)\}/g, (_match, key) => {
        keys.push(key);

        return _match;
      });

      const uniqueKeys = [...new Set(keys)];

      let parsedUrl = this.data.url;

      const environmentVariables = await Environments.selectedEnvironment?.getParsedVariables(new AbortController());

      for(let key of uniqueKeys) {
        const parameter = this.data.parameters.find((parameter) => parameter.key === key);

        if(!parameter) {
          const environmentVariable = environmentVariables?.find((environmentVariable) => environmentVariable.key === key);

          if(environmentVariable) {
            parsedUrl = parsedUrl?.replace('{' + key + '}', environmentVariable.value);
          }

          continue;
        }

        try {
          const value = await Scripts.evaluateUserInput(parameter);

          parsedUrl = parsedUrl?.replace('{' + key + '}', value);
        }
        catch(error) {
          reject(error);
        }
      }

      abortController.signal.removeEventListener("abort", abortListener);

      resolve(parsedUrl);
    });
  }

  async getParsedHeaders(abortController: AbortController) {
    return new Promise<{ headers: Record<string, string> }>(async (resolve, reject) => {
      const abortListener = () => reject("Aborted.");
      abortController.signal.addEventListener("abort", abortListener);

      const headers: Record<string, string> = {};

      for(let header of this.data.headers) {
        try {
          const value = await Scripts.evaluateUserInput(header);

          headers[header.key] = value;
        }
        catch(error) {
          reject(error);
        }
      }

      abortController.signal.removeEventListener("abort", abortListener);

      resolve({ headers });
    });
  }

  send(): void {
    commands.executeCommand("norasoderlund.integrationworkbench.addResponse", new WorkbenchHttpResponse(
      randomUUID(),
      this.getData(),
      new Date()
    ));
  }

  setName(name: string) {
    this.name = name;
    
    if(this.webview.requestWebviewPanel) {
      this.webview.requestWebviewPanel.webviewPanel.title = name;
    }
    
    this.parent?.save();
  }
  
  setMethod(method: string) {
    this.data.method = method;

    this.webview.treeDataViewItem?.setIconPath();

    commands.executeCommand("norasoderlund.integrationworkbench.refreshWorkbenches");

    this.parent?.save();
  }
  
  setUrl(url: string) {
    this.data.url = url;

    this.parent?.save();
  }

  setAuthorization(authorizationData: WorkbenchHttpAuthorization) {
    this.data.authorization = authorizationData;

    this.parent?.save();
  }

  setBody(bodyData: WorkbenchHttpRequestBodyData) {
    this.data.body = bodyData;

    this.parent?.save();
  }

  setHeaders(headers: UserInput[]) {
    this.data.headers = headers;

    this.parent?.save();
  }

  setParameters(parameters: UserInput[]) {
    this.data.parameters = parameters;

    this.parent?.save();
  }
}