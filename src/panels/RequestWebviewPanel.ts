import { Disposable, ExtensionContext, Uri, ViewColumn, WebviewPanel, TextDocument, window, workspace, commands, ThemeIcon } from "vscode";
import { Workbench } from "../workbenches/Workbench";
import { getWebviewUri } from "../utils/GetWebviewUri";
import getWebviewNonce from "../utils/GetWebviewNonce";
import { readFileSync } from "fs";
import path from "path";
import WorkbenchRequest from "../workbenches/requests/WorkbenchRequest";
import WorkbenchHttpRequest from "../workbenches/requests/WorkbenchHttpRequest";
import { WorkbenchResponseData } from "../interfaces/workbenches/responses/WorkbenchResponseData";
import WorkbenchHttpResponse from "../workbenches/responses/WorkbenchHttpResponse";
import { randomUUID } from "crypto";

export class RequestWebviewPanel {
  public readonly webviewPanel: WebviewPanel;
  private readonly disposables: Disposable[] = [];

  constructor(
    private readonly context: ExtensionContext,
		private readonly request: WorkbenchRequest
  ) {
    this.webviewPanel = window.createWebviewPanel(
      "integrationWorkbench.request",
      request.name,
      ViewColumn.One,
      {
        enableScripts: true,

        localResourceRoots: [
          Uri.joinPath(context.extensionUri, 'build'),
          Uri.joinPath(context.extensionUri, 'resources')
        ]
      }
    );

    

    /*const iconPath = request.getIconPath();

    if(!(iconPath instanceof ThemeIcon)) {
      this.webviewPanel.iconPath = iconPath;
    }*/

    this.webviewPanel.onDidDispose(() => this.dispose(), null, this.disposables);

    const webviewUri = getWebviewUri(this.webviewPanel.webview, context.extensionUri, ["build", "webviews", "request.js"]);
    const styleUri = getWebviewUri(this.webviewPanel.webview, context.extensionUri, ["resources", "request", "styles", "request.css"]);
    const shikiUri = getWebviewUri(this.webviewPanel.webview, context.extensionUri, ["resources", "shiki"]);

    this.webviewPanel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8"/>

          <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
          
          <title>Hello World!</title>

          <link rel="stylesheet" href="${styleUri}"/>
        </head>
        <body>
          ${readFileSync(
            path.join(__filename, "..", "..", "resources", "request", "request.html"),
            {
              encoding: "utf-8"
            }
          )}

          <script type="text/javascript">
            window.shikiUri = "${shikiUri}";
          </script>

          <script type="module" src="${webviewUri}"></script>
        </body>
      </html>
    `;

    this.webviewPanel.webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;

        console.debug("Received event from request webview:", command);

        switch (command) {
          case "integrationWorkbench.changeHttpRequestMethod": {
            const [ method ] = message.arguments;

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setMethod(method);
            }

            return;
          }

          case "integrationWorkbench.changeHttpRequestUrl": {
            const [ url ] = message.arguments;

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setUrl(url);
            }

            return;
          }

          case "integrationWorkbench.sendHttpRequest": {
            commands.executeCommand("integrationWorkbench.addResponse", new WorkbenchHttpResponse(
              randomUUID(),
              this.request.getData(),
              new Date()
            ));

            return;
          }

          case "integrationWorkbench.getRequest": {
            this.webviewPanel.webview.postMessage({
              command: "integrationWorkbench.updateRequest",
              arguments: [ this.request.getData() ]
            });

            return;
          }
        }
      },
      undefined,
      this.disposables
    );
  }

  reveal() {
    const columnToShowIn = window.activeTextEditor ? window.activeTextEditor.viewColumn : undefined;

    this.webviewPanel.reveal(columnToShowIn);
  }

  dispose() {
    this.webviewPanel.dispose();

    while (this.disposables.length) {
      const disposable = this.disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }

    this.request.disposeWebviewPanel();
  }
}