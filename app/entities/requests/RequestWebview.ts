import { ExtensionContext, Uri, commands } from "vscode";
import { WorkbenchRequestData } from "~interfaces/workbenches/requests/WorkbenchRequestData";
import { isEventBridgeRequestData, isHttpRequestData } from "~interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import { RequestWebviewPanel } from "../../views/webviews/RequestWebviewPanel";
import HttpRequest from "./http/WorkbenchHttpRequest";
import { Workbench } from "../workbenches/Workbench";
import { WorkbenchCollection } from "../collections/WorkbenchCollection";
import WorkbenchRequestTreeItem from "../../views/trees/workbenches/items/WorkbenchRequestTreeItem";
import WorkbenchEventBridgeRequest from "./aws/WorkbenchEventBridgeRequest";
import WorkbenchRequest from "./WorkbenchRequest";

export default class RequestWebview {
  public treeDataViewItem?: WorkbenchRequestTreeItem;
  public requestWebviewPanel?: RequestWebviewPanel;

  constructor(
    private readonly request: WorkbenchRequest
  ) {

  }

  showWebviewPanel(context: ExtensionContext) {
    if(!this.requestWebviewPanel) {
      this.requestWebviewPanel = new RequestWebviewPanel(context, this.request);

      if(this.treeDataViewItem?.iconPath instanceof Uri) {
        this.setWebviewPanelIcon(this.treeDataViewItem.iconPath);
      }
    }
    else {
      this.requestWebviewPanel.reveal();
    }
		
    commands.executeCommand("norasoderlund.integrationworkbench.openResponse", this);
  }

  setWebviewPanelIcon(icon: Uri) {
    if(this.requestWebviewPanel) {
      this.requestWebviewPanel.webviewPanel.iconPath = icon;
    }
  }

  deleteWebviewPanel() {
    delete this.requestWebviewPanel;
  }

  disposeWebviewPanel() {
    this.requestWebviewPanel?.dispose();
  }
};
