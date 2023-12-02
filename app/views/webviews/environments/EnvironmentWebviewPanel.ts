import { Disposable, ExtensionContext, ThemeIcon, Uri, ViewColumn, WebviewPanel, window } from "vscode";
import EnvironmentPreviewVariablesPanel from "./preivews/EnvironmentPreviewVariablesPanel";
import Environment from "../../../entities/Environment";
import { readFileSync } from "fs";
import path from "path";
import { getWebviewUri } from "../../../utils/GetWebviewUri";

export class EnvironmentWebviewPanel {
  public readonly webviewPanel: WebviewPanel;
  public readonly disposables: Disposable[] = [];

  private previewVariables?: EnvironmentPreviewVariablesPanel;

  constructor(
    private readonly context: ExtensionContext,
		public readonly environment: Environment
  ) {
    this.webviewPanel = window.createWebviewPanel(
      "integrationWorkbench.request",
      environment.data.name,
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
            
            window.type = "environment";
          </script>

          <script src="${monacoEditorLoaderUri}"></script>

          <script src="${webviewUri}"></script>
        </body>
      </html>
    `;

    this.webviewPanel.webview.onDidReceiveMessage(
      async (message: any) => {
        const command = message.command;

        console.debug("Received event from request webview:", command);

        switch (command) {
          case "integrationWorkbench.getRequest": {
            this.updateEnvironment();

            return;
          }
        }
      },
      undefined,
      this.disposables
    );

    this.previewVariables = new EnvironmentPreviewVariablesPanel(this, environment);
  }

  private updateEnvironment() {
    this.webviewPanel.webview.postMessage({
      command: "integrationWorkbench.updateEnvironment",
      arguments: [ this.environment.data ]
    });
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

    this.environment.deleteWebviewPanel();
  }
}