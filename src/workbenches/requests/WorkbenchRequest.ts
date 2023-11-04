import { ExtensionContext, commands } from "vscode";
import { WorkbenchRequestData } from "../../interfaces/workbenches/requests/WorkbenchRequestData";
import { isHttpRequestData } from "../../interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import { RequestWebviewPanel } from "../../panels/RequestWebviewPanel";
import HttpRequest from "./WorkbenchHttpRequest";

export default class WorkbenchRequest {
  id: string;
  name: string;

  private requestWebviewPanel?: RequestWebviewPanel;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  getData(): WorkbenchRequestData {
    return {
      id: this.id,
      name: this.name,
      type: "HTTP",
      data: {}
    };
  }

  static fromData(data: WorkbenchRequestData) {
    if(isHttpRequestData(data)) {
      return HttpRequest.fromData(data);
    }

    throw new Error("Tried to parse invalid request type.");
  }

  send() {
    throw new Error("Not implemented.");
  }

  showWebviewPanel(context: ExtensionContext) {
    if(!this.requestWebviewPanel) {
      this.requestWebviewPanel = new RequestWebviewPanel(context, this);
    }
    else {
      this.requestWebviewPanel.reveal();
    }
		
    commands.executeCommand("integrationWorkbench.openResponse", this);
  }
};
