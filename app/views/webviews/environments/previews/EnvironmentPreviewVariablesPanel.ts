import { StatusBarAlignment, StatusBarItem, ThemeColor, window } from "vscode";
import { WorkbenchHttpRequestPreviewHeadersData } from "~interfaces/workbenches/requests/WorkbenchHttpRequestPreviewHeadersData";
import { EnvironmentWebviewPanel } from "../EnvironmentWebviewPanel";
import Environment from "../../../../entities/environments/Environment";
import { outputChannel } from "../../../../extension";
import { EnvironmentPreviewVariablesData } from "~interfaces/entities/EnvironmentPreviewVariablesData";

export default class EnvironmentPreviewVariablesPanel {
  public readonly statusBarItem: StatusBarItem;

  constructor(
    private readonly environmentWebviewPanel: EnvironmentWebviewPanel,
    private readonly environment: Environment
  ) {
    this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);

    this.environmentWebviewPanel.webviewPanel.onDidChangeViewState((event) => {
      if(event.webviewPanel.active) {
        this.statusBarItem.show();
      }
      else {
        this.statusBarItem.hide();
      }
    });

    this.environmentWebviewPanel.disposables.push(this.statusBarItem);

    this.environmentWebviewPanel.webviewPanel.webview.onDidReceiveMessage(
      async ({ command }: any) => {
        switch (command) {

          case "norasoderlund.integrationworkbench.getEnvironmentVariablesPreview": {
            this.updatePreviewVariables();

            return;
          }
        }
      }
    );
  }

  async updatePreviewVariables() {
    this.statusBarItem.text = "$(loading~spin) Building preview variables...";
    this.statusBarItem.show();

    let previewHeadersData: EnvironmentPreviewVariablesData;

    const timestamp = performance.now();

    console.log("try");

    try {
      console.log("get parsed headers");

      const items = await this.environment.getParsedVariables(new AbortController());
      console.log("succeed");

      previewHeadersData = {
        success: true,
        duration: performance.now() - timestamp,
        items
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

    this.environmentWebviewPanel.webviewPanel.webview.postMessage({
      command: "norasoderlund.integrationworkbench.updateEnvironmentPreviewVariables",
      arguments: [ previewHeadersData ]
    });

    console.log("send update");

    this.statusBarItem.text = "";
    this.statusBarItem.hide();
  }
}
