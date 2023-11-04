import { Disposable, ExtensionContext, Uri, ViewColumn, WebviewPanel, window } from "vscode";
import { Workbench } from "../interfaces/workbenches/Workbench";
import { WorkbenchRequest } from "../interfaces/workbenches/requests/WorkbenchRequest";
import { WorkbenchCollection } from "../interfaces/workbenches/collections/WorkbenchCollection";
import { getWebviewUri } from "../utils/GetWebviewUri";
import getWebviewNonce from "../utils/GetWebviewNonce";
import { readFileSync } from "fs";
import path from "path";

export class RequestWebviewPanel {
  private readonly webviewPanel: WebviewPanel;
  private readonly disposables: Disposable[] = [];

  constructor(
    private readonly context: ExtensionContext,
    private readonly workbench: Workbench,
		private readonly request: WorkbenchRequest,
		private readonly collection?: WorkbenchCollection
  ) {
    this.webviewPanel = window.createWebviewPanel(
      `request-${request.id}`,
      request.name,
      ViewColumn.One,
      {
        enableScripts: true,

        localResourceRoots: [Uri.joinPath(context.extensionUri, 'build')]
      }
    );

    this.webviewPanel.onDidDispose(() => this.dispose(), null, this.disposables);

    const webviewUri = getWebviewUri(this.webviewPanel.webview, context.extensionUri, ["build", "webview.js"]);
    const nonce = getWebviewNonce();

    this.webviewPanel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">

          <meta name="viewport" content="width=device-width,initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}';">

          <title>Hello World!</title>
        </head>
        <body>
          ${readFileSync(
            path.join(__filename, "..", "..", "resources", "request", "index.html"),
            {
              encoding: "utf-8"
            }
          )}

          <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
        </body>
      </html>
    `;


    this.webviewPanel.webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;
        const text = message.text;

        switch (command) {
          case "hello":
            window.showInformationMessage(text);
            return;
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
  }
}