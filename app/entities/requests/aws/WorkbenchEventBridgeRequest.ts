import { WorkbenchEventBridgeRequestData } from "~interfaces/workbenches/requests/aws/WorkbenchEventBridgeRequestData";
import WorkbenchRequest from "../WorkbenchRequest";
import { Workbench } from "../../workbenches/Workbench";
import { WorkbenchCollection } from "../../collections/WorkbenchCollection";
import RequestWebview from "../RequestWebview";

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
        eventBridgeArn: this.data.eventBridgeArn,
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
    
  }
}
