import { WorkbenchEventBridgeRequestData } from "~interfaces/workbenches/requests/aws/WorkbenchEventBridgeRequestData";
import WorkbenchRequest from "../WorkbenchRequest";
import { Workbench } from "../../workbenches/Workbench";
import { WorkbenchCollection } from "../../collections/WorkbenchCollection";
import RequestWebview from "../RequestWebview";
import { commands } from "vscode";
import WorkbenchEventBridgeResponse from "../../responses/aws/WorkbenchEventBridgeResponse";
import { randomUUID } from "crypto";
import Environments from "../../../instances/Environments";
import Scripts from "../../../instances/Scripts";

export default class WorkbenchEventBridgeRequest implements WorkbenchRequest {
  public readonly id: string;
  public name: string;
  public data: WorkbenchEventBridgeRequestData["data"];
  public webview: RequestWebview;

  constructor(
    public readonly parent: Workbench | WorkbenchCollection | null,
    data: WorkbenchEventBridgeRequestData
  ) {
    this.id = data.id;
    this.name = data.name;
    this.data = data.data;
    this.webview = new RequestWebview(this);
  }

  getData(): WorkbenchEventBridgeRequestData {
    return {
      id: this.id,
      name: this.name,
      type: "EventBridge",
      data: {
        region: this.data.region,
        eventBridgeArn: this.data.eventBridgeArn,
        body: {
          ...this.data.body
        },
        eventSource: {
          ...this.data.eventSource
        },
        detailType: {
          ...this.data.detailType
        },
        time: {
          ...this.data.time
        },
        resources: this.data.resources.map((resource) => {
          return {
            ...resource
          }
        }),
        parameters: this.data.parameters,
        parametersAutoRefresh: this.data.parametersAutoRefresh
      }
    };
  }

  setName(name: string) {
    this.name = name;
    
    if(this.webview.requestWebviewPanel) {
      this.webview.requestWebviewPanel.webviewPanel.title = name;
    }
    
    this.parent?.save();
  }

  send(): void {
    commands.executeCommand("norasoderlund.integrationworkbench.addResponse", new WorkbenchEventBridgeResponse(
      randomUUID(),
      this.getData(),
      new Date()
    ));
  }

  async getParsedEventBridgeArn(abortController: AbortController) {
    return new Promise<string>(async (resolve, reject) => {
      if(!this.data.eventBridgeArn) {
        reject("Request EventBridge aRN is falsey.");

        return;
      }

      const abortListener = () => reject("Aborted.");
      abortController.signal.addEventListener("abort", abortListener);

      const keys: string[] = [];

      this.data.eventBridgeArn.replace(/\{(.+?)\}/g, (_match, key) => {
        keys.push(key);

        return _match;
      });

      const uniqueKeys = [...new Set(keys)];

      let parsedUrl = this.data.eventBridgeArn;

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
}
