import { ThemeIcon, Uri, commands } from "vscode";
import { WorkbenchHttpAuthorization, WorkbenchHttpRequestBodyData, WorkbenchHttpRequestData, WorkbenchHttpRequestHeaderData, WorkbenchHttpRequestParameterData } from "~interfaces/workbenches/requests/WorkbenchHttpRequestData";
import { Workbench } from "../Workbench";
import { WorkbenchCollection } from "../collections/WorkbenchCollection";
import WorkbenchRequest from "./WorkbenchRequest";
import path from "path";
import { existsSync } from "fs";
import WorkbenchHttpResponse from "../responses/WorkbenchHttpResponse";
import { randomUUID } from "crypto";
import Scripts from "../../Scripts";

export default class WorkbenchHttpRequest extends WorkbenchRequest {
  constructor(
    parent: Workbench | WorkbenchCollection | null,
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
        authorization: {
          ...this.data.authorization
        },
        method: this.data.method,
        url: this.data.url,
        headers: [ ...this.data.headers ],
        parameters: [ ...this.data.parameters ],
        parametersAutoRefresh: this.data.parametersAutoRefresh,
        body: {
          ...this.data.body
        }
      }
    };
  }
  
  static fromData(parent: Workbench | WorkbenchCollection | null, data: WorkbenchHttpRequestData) {
    return new WorkbenchHttpRequest(parent, data.id, data.name, data.data);
  }

  async getParsedUrl(abortController: AbortController) {
    return new Promise<string | null>(async (resolve, reject) => {
      if(!this.data.url) {
        resolve(null);

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

      for(let key of uniqueKeys) {
        const parameter = this.data.parameters.find((parameter) => parameter.name === key);

        if(!parameter) {
          continue;
        }

        switch(parameter.type) {
          case "raw": {
            parsedUrl = parsedUrl?.replace('{' + key + '}', parameter.value);

            break;
          }

          case "typescript": {
            // TODO: add ability to view the entire script that's being evaluated for debugging purposes?
            const scriptIndex = await Scripts.buildScriptIndex();
          
            const script = scriptIndex.concat(parameter.value);

            let value;

            try {
              value = await eval(script);
            }
            catch(error) {
              throw new Error("Failed to evaluate script: " + error);
            }

            parsedUrl = parsedUrl?.replace('{' + key + '}', value);
          }
        }
      }

      abortController.signal.removeEventListener("abort", abortListener);

      resolve(parsedUrl);
    });
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

  setHeaders(headers: WorkbenchHttpRequestHeaderData[]) {
    this.data.headers = headers;

    this.parent?.save();
  }

  setParameters(parameters: WorkbenchHttpRequestParameterData[]) {
    this.data.parameters = parameters;

    this.parent?.save();
  }
}