import { StatusBarAlignment, StatusBarItem, ThemeColor, window } from "vscode";
import { RequestWebviewPanel } from "../RequestWebviewPanel";
import WorkbenchHttpRequest from "../../../entities/requests/WorkbenchHttpRequest";
import { outputChannel } from "../../../extension";
import { WorkbenchHttpRequestPreviewUrlData } from "~interfaces/workbenches/requests/WorkbenchHttpRequestPreviewUrlData";


export default class RequestPreviewUrlPanel {
  public readonly statusBarItem: StatusBarItem;

  constructor(
    private readonly requestWebviewPanel: RequestWebviewPanel,
    private readonly request: WorkbenchHttpRequest
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

          case "norasoderlund.integrationworkbench.getHttpRequestPreviewUrl": {
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

    let previewUrlData: WorkbenchHttpRequestPreviewUrlData;

    const timestamp = performance.now();

    try {
      const url = await this.request.getParsedUrl(new AbortController());

      previewUrlData = {
        success: true,
        duration: performance.now() - timestamp,
        url
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
      command: "norasoderlund.integrationworkbench.updateHttpRequestPreviewUrl",
      arguments: [ previewUrlData ]
    });

    this.statusBarItem.text = "";
    this.statusBarItem.hide();
  }
}
