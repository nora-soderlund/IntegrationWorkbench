import { ExtensionContext, ThemeIcon, Uri, commands } from "vscode";
import { WorkbenchRequestData } from "~interfaces/workbenches/requests/WorkbenchRequestData";
import { isHttpRequestData } from "~interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import { RequestWebviewPanel } from "../../views/webviews/RequestWebviewPanel";
import HttpRequest from "./WorkbenchHttpRequest";
import { Workbench } from "../workbenches/Workbench";
import { WorkbenchCollection } from "../collections/WorkbenchCollection";
import WorkbenchRequestTreeItem from "../../views/trees/workbenches/items/WorkbenchRequestTreeItem";

export default class WorkbenchRequest {
  id: string;
  name: string;

  public requestWebviewPanel?: RequestWebviewPanel;
  public treeDataViewItem?: WorkbenchRequestTreeItem;

  constructor(public readonly parent: Workbench | WorkbenchCollection | null, id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  getData(): WorkbenchRequestData {
    return {
      id: this.id,
      name: this.name,
      type: "HTTP",
      data: {
        method: "",
        parameters: [],
        parametersAutoRefresh: false,
        authorization: {
          type: "none"
        },
        headers: [
          {
            type: "raw",
            key: "Content-Type",
            value: "application/json"
          }
        ],
        headersAutoRefresh: false,
        body: {
          type: "none"
        }
      }
    };
  }

  static fromData(parent: Workbench | WorkbenchCollection, data: WorkbenchRequestData) {
    if(isHttpRequestData(data)) {
      return HttpRequest.fromData(parent, data);
    }

    throw new Error("Tried to parse invalid request type.");
  }

  send() {
    throw new Error("Not implemented.");
  }

  showWebviewPanel(context: ExtensionContext) {
    if(!this.requestWebviewPanel) {
      this.requestWebviewPanel = new RequestWebviewPanel(context, this);

      if(this.treeDataViewItem?.iconPath instanceof Uri) {
        this.setWebviewPanelIcon(this.treeDataViewItem.iconPath);
      }
    }
    else {
      this.requestWebviewPanel.reveal();
    }
		
    commands.executeCommand("integrationWorkbench.openResponse", this);
  }

  setWebviewPanelIcon(icon: Uri) {
    if(this.requestWebviewPanel) {
      this.requestWebviewPanel.webviewPanel.iconPath = icon;
    }
  }
  
  setName(name: string) {
    this.name = name;
    
    if(this.requestWebviewPanel) {
      this.requestWebviewPanel.webviewPanel.title = name;
    }
    
    this.parent?.save();
  }

  deleteWebviewPanel() {
    delete this.requestWebviewPanel;
  }

  disposeWebviewPanel() {
    this.requestWebviewPanel?.dispose();
  }
};