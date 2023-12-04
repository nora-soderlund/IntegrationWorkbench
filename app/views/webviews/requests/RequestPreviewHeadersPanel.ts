import { StatusBarAlignment, StatusBarItem, ThemeColor, window } from "vscode";
import { RequestWebviewPanel } from "../RequestWebviewPanel";
import WorkbenchHttpRequest from "../../../entities/requests/http/WorkbenchHttpRequest";
import { outputChannel } from "../../../extension";
import { WorkbenchHttpRequestPreviewHeadersData } from "~interfaces/workbenches/requests/WorkbenchHttpRequestPreviewHeadersData";


export default class RequestPreviewHeadersPanel {
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

          case "norasoderlund.integrationworkbench.getHttpRequestPreviewHeaders": {
            this.updatePreviewHeaders();

            return;
          }
        }
      }
    );
  }

  async updatePreviewHeaders() {
    this.statusBarItem.text = "$(loading~spin) Building preview headers...";
    this.statusBarItem.show();

    let previewHeadersData: WorkbenchHttpRequestPreviewHeadersData;

    const timestamp = performance.now();

    console.log("try");

    try {
      console.log("get parsed headers");

      const { headers } = await this.request.getParsedHeaders(new AbortController());
      console.log("succeed");

      previewHeadersData = {
        success: true,
        duration: performance.now() - timestamp,
        headers
      };
    }
    catch(error) {
      if(error instanceof Error) {
        outputChannel.error(error);

        //this.statusBarItem.text = "$(error) Failed to build preview";
        //this.statusBarItem.backgroundColor = new ThemeColor("statusBarItem.errorBackground");
        //this.statusBarItem.color = new ThemeColor("statusBarItem.errorForeground");

        previewHeadersData = {
          success: false,
          error: error.message,
          duration: performance.now() - timestamp
        };
      }
      else {
        previewHeadersData = {
          success: false,
          duration: performance.now() - timestamp
        };
      }
    }

    this.requestWebviewPanel.webviewPanel.webview.postMessage({
      command: "norasoderlund.integrationworkbench.updateHttpRequestPreviewHeaders",
      arguments: [ previewHeadersData ]
    });

    console.log("send update");

    this.statusBarItem.text = "";
    this.statusBarItem.hide();
  }
}
