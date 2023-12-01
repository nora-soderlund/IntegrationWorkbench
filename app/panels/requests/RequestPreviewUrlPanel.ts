import { StatusBarAlignment, StatusBarItem, ThemeColor, window } from "vscode";
import { RequestWebviewPanel } from "../RequestWebviewPanel";
import WorkbenchHttpRequest from "../../workbenches/requests/WorkbenchHttpRequest";
import { outputChannel } from "../../extension";

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

          case "integrationWorkbench.getHttpRequestPreviewUrl": {
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

    try {
      this.requestWebviewPanel.webviewPanel.webview.postMessage({
        command: "integrationWorkbench.updateHttpRequestPreviewUrl",
        arguments: [ true, await this.request.getParsedUrl(new AbortController()) ]
      });
    }
    catch(error) {
      if(error instanceof Error || typeof error === "string") {
        outputChannel.error(error);

        this.requestWebviewPanel.webviewPanel.webview.postMessage({
          command: "integrationWorkbench.updateHttpRequestPreviewUrl",
          arguments: [ false ]
        });

        //this.statusBarItem.text = "$(error) Failed to build preview";
        //this.statusBarItem.backgroundColor = new ThemeColor("statusBarItem.errorBackground");
        //this.statusBarItem.color = new ThemeColor("statusBarItem.errorForeground");
      }
    }
    finally {
      this.statusBarItem.text = "";
      this.statusBarItem.hide();
    }
  }
}
