import { StatusBarAlignment, StatusBarItem, ThemeColor, window } from "vscode";
import { RequestWebviewPanel } from "../RequestWebviewPanel";
import WorkbenchHttpRequest from "../../../entities/requests/http/WorkbenchHttpRequest";
import { outputChannel } from "../../../extension";
import { WorkbenchEventBridgeRequestPreviewArnData } from "~interfaces/workbenches/requests/aws/WorkbenchEventBridgeRequestPreviewArnData";
import WorkbenchEventBridgeRequest from "../../../entities/requests/aws/WorkbenchEventBridgeRequest";


export default class RequestPreviewEventBridgeArnPanel {
  public readonly statusBarItem: StatusBarItem;

  constructor(
    private readonly requestWebviewPanel: RequestWebviewPanel,
    private readonly request: WorkbenchEventBridgeRequest
  ) {
    this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);

    this.requestWebviewPanel.webviewPanel.onDidChangeViewState((event) => {
      if(event.webviewPanel.active) {
        this.statusBarItem.show();
      }
      else {
        this.statusBarItem.hide();
      }
    });

    this.requestWebviewPanel.disposables.push(this.statusBarItem);

    this.requestWebviewPanel.webviewPanel.webview.onDidReceiveMessage(
      async ({ command }: any) => {
        switch (command) {

          case "norasoderlund.integrationworkbench.getEventBridgePreviewArn": {
            this.updatePreviewUrl();

            return;
          }
        }
      }
    );
  }

  async updatePreviewUrl() {
    this.statusBarItem.text = "$(loading~spin) Building preview...";
    this.statusBarItem.show();

    let previewUrlData: WorkbenchEventBridgeRequestPreviewArnData;

    const timestamp = performance.now();

    try {
      const url = await this.request.getParsedEventBridgeArn(new AbortController());

      previewUrlData = {
        success: true,
        duration: performance.now() - timestamp,
        eventBridgeArn: url
      };
    }
    catch(error) {
      if(error instanceof Error) {
        outputChannel.error(error);

        //this.statusBarItem.text = "$(error) Failed to build preview";
        //this.statusBarItem.backgroundColor = new ThemeColor("statusBarItem.errorBackground");
        //this.statusBarItem.color = new ThemeColor("statusBarItem.errorForeground");

        previewUrlData = {
          success: false,
          error: error.message,
          duration: performance.now() - timestamp
        };
      }
      else {
        previewUrlData = {
          success: false,
          duration: performance.now() - timestamp
        };
      }
    }

    this.requestWebviewPanel.webviewPanel.webview.postMessage({
      command: "norasoderlund.integrationworkbench.updateEventBridgePreviewArn",
      arguments: [ previewUrlData ]
    });

    this.statusBarItem.text = "";
    this.statusBarItem.hide();
  }
}
