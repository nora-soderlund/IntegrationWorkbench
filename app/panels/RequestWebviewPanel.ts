import { Disposable, ExtensionContext, Uri, ViewColumn, WebviewPanel, TextDocument, window, workspace, commands, ThemeIcon } from "vscode";
import { getWebviewUri } from "../utils/GetWebviewUri";
import { readFileSync } from "fs";
import path from "path";
import WorkbenchRequest from "../workbenches/requests/WorkbenchRequest";
import WorkbenchHttpRequest from "../workbenches/requests/WorkbenchHttpRequest";

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
          Uri.joinPath(context.extensionUri, 'resources'),
          Uri.joinPath(context.extensionUri, 'node_modules', 'monaco-editor', 'min', 'vs'),
          Uri.joinPath(context.extensionUri, 'node_modules', '@vscode', 'codicons')
        ]
      }
    );

    this.webviewPanel.onDidDispose(() => this.dispose(), null, this.disposables);

		const manifest = JSON.parse(readFileSync(path.join(context.extensionPath, 'build', 'asset-manifest.json'), {
      encoding: "utf-8"
    }));

    const webviewUri = getWebviewUri(this.webviewPanel.webview, context.extensionUri, ["build", manifest['files']['main.js']]);
    const globalStyleUri = getWebviewUri(this.webviewPanel.webview, context.extensionUri, ["resources", "request", "styles", "global.css"]);
    const monacoEditorLoaderUri = getWebviewUri(this.webviewPanel.webview, context.extensionUri, ["node_modules", "monaco-editor", 'min', 'vs', 'loader.js']);
    const codiconsUri = getWebviewUri(this.webviewPanel.webview, context.extensionUri, [ 'node_modules', '@vscode/codicons', 'dist', 'codicon.css' ]);

    this.webviewPanel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8"/>

          <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
          
          <title>Hello World!</title>

          <link rel="stylesheet" href="${globalStyleUri}"/>
          <link rel="stylesheet" href="${codiconsUri}"/>
        </head>
        <body>
          <div id="root"></div>

          <script type="text/javascript">
            window.vscode = acquireVsCodeApi();
            
            window.type = "request";
          </script>

          <script src="${monacoEditorLoaderUri}"></script>

          <script src="${webviewUri}"></script>
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

            this.webviewPanel.webview.postMessage({
              command: "integrationWorkbench.updateRequest",
              arguments: [ this.request.getData() ]
            });

            return;
          }

          case "integrationWorkbench.changeHttpRequestUrl": {
            const [ url ] = message.arguments;

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setUrl(url);
            }

            this.webviewPanel.webview.postMessage({
              command: "integrationWorkbench.updateRequest",
              arguments: [ this.request.getData() ]
            });

            return;
          }

          case "integrationWorkbench.changeHttpRequestHeaders": {
            const [ headers ] = message.arguments;

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setHeaders(headers);
            }

            this.webviewPanel.webview.postMessage({
              command: "integrationWorkbench.updateRequest",
              arguments: [ this.request.getData() ]
            });

            return;
          }

          case "integrationWorkbench.changeHttpRequestBody": {
            const [ bodyData ] = message.arguments;

            console.log(bodyData);

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setBody(bodyData);
            }

            this.webviewPanel.webview.postMessage({
              command: "integrationWorkbench.updateRequest",
              arguments: [ this.request.getData() ]
            });

            return;
          }

          case "integrationWorkbench.sendHttpRequest": {
            this.request.send();

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

    this.request.deleteWebviewPanel();
  }
}