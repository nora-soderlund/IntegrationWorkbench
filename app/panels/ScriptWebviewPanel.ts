import { Disposable, ExtensionContext, Uri, ViewColumn, WebviewPanel, TextDocument, window, workspace, commands, ThemeIcon } from "vscode";
import { getWebviewUri } from "../utils/GetWebviewUri";
import { readFileSync } from "fs";
import path from "path";
import WorkbenchRequest from "../workbenches/requests/WorkbenchRequest";
import WorkbenchHttpRequest from "../workbenches/requests/WorkbenchHttpRequest";
import Scripts from "../Scripts";
import Script from "../scripts/Script";
import { ScriptDeclarationData } from "~interfaces/scripts/ScriptDeclarationData";

export class ScriptWebviewPanel {
  public readonly webviewPanel: WebviewPanel;
  private readonly disposables: Disposable[] = [];

  constructor(
    private readonly context: ExtensionContext,
		private readonly script: Script
  ) {
    this.webviewPanel = window.createWebviewPanel(
      "integrationWorkbench.script",
      script.data.name,
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
            
            window.type = "script";
          </script>

          <script src="${monacoEditorLoaderUri}"></script>

          <script src="${webviewUri}"></script>
        </body>
      </html>
    `;

    this.webviewPanel.webview.onDidReceiveMessage(
      async (message: any) => {
        const command = message.command;

        console.debug("Received event from script webview:", command);

        switch (command) {
          case "integrationWorkbench.getScriptDeclarations": {
            const scriptDeclarations = await Promise.allSettled(Scripts.loadedScripts.map(async (script) => await script.getDeclarationData()));

            this.webviewPanel.webview.postMessage({
              command: "integrationWorkbench.updateScriptDeclarations",
              arguments: [
                scriptDeclarations.filter((scriptDeclaration) => scriptDeclaration.status === "fulfilled").map((scriptDeclaration) => (scriptDeclaration as PromiseFulfilledResult<ScriptDeclarationData>).value).concat([
                  {
                    name: "ts:environment.d.ts",
                    declaration: "declare const process: { env: { HELLO: string; }; };"
                  }
                ])
              ]
            });

            return;
          }

          case "integrationWorkbench.getScript": {
            this.webviewPanel.webview.postMessage({
              command: "integrationWorkbench.updateScript",
              arguments: [ this.script.getContentData() ]
            });

            return;
          }

          case "integrationWorkbench.changeScriptContent": {
            const [ content ] = message.arguments;

            this.script.setContent(content);

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

    this.script.deleteWebviewPanel();
  }
}