import { Disposable, ExtensionContext, Uri, ViewColumn, WebviewPanel, TextDocument, window, workspace, commands, ThemeIcon, StatusBarAlignment, StatusBarItem, ThemeColor } from "vscode";
import { getWebviewUri } from "../utils/GetWebviewUri";
import { readFileSync } from "fs";
import path from "path";
import WorkbenchRequest from "../workbenches/requests/WorkbenchRequest";
import WorkbenchHttpRequest from "../workbenches/requests/WorkbenchHttpRequest";
import Scripts from "../Scripts";
import Script from "../scripts/TypescriptScript";
import { ScriptDeclarationData } from "~interfaces/scripts/ScriptDeclarationData";
import RequestPreviewUrlPanel from "./requests/RequestPreviewUrlPanel";

export class RequestWebviewPanel {
  public readonly webviewPanel: WebviewPanel;
  public readonly disposables: Disposable[] = [];

  private previewUrl?: RequestPreviewUrlPanel;

  constructor(
    private readonly context: ExtensionContext,
		public readonly request: WorkbenchRequest
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
      async (message: any) => {
        const command = message.command;

        console.debug("Received event from request webview:", command);

        switch (command) {
          case "integrationWorkbench.changeHttpRequestMethod": {
            const [ method ] = message.arguments;

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setMethod(method);
            }

            this.updateRequest();

            return;
          }

          case "integrationWorkbench.changeHttpRequestUrl": {
            const [ url ] = message.arguments;

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setUrl(url);
            }

            this.updateRequest();

            return;
          }

          case "integrationWorkbench.changeHttpRequestHeaders": {
            const [ headers ] = message.arguments;

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setHeaders(headers);
            }

            this.updateRequest();

            return;
          }

          case "integrationWorkbench.changeHttpRequestParameters": {
            const [ parameters ] = message.arguments;

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setParameters(parameters);

              if(this.request.data.parametersAutoRefresh) {
                this.previewUrl?.updatePreviewUrl();
              }
            }

            this.updateRequest();

            return;
          }

          case "integrationWorkbench.changeHttpRequestBody": {
            const [ bodyData ] = message.arguments;

            console.log(bodyData);

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setBody(bodyData);
            }

            this.updateRequest();

            return;
          }

          case "integrationWorkbench.changeHttpRequestAuthorization": {
            const [ authorizationData ] = message.arguments;

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setAuthorization(authorizationData);
            }

            this.updateRequest();

            return;
          }

          case "integrationWorkbench.sendHttpRequest": {
            this.request.send();

            return;
          }

          case "integrationWorkbench.getRequest": {
            this.updateRequest();

            return;
          }

          case "integrationWorkbench.getScriptDeclarations": {
            type ScriptBuildResult = {
              script: Script,
              build: {
                declaration: string;
                javascript: string;
              };
            };

            const promises = await Promise.allSettled(Scripts.loadedScripts.map<Promise<ScriptBuildResult>>(async (script) => {
              return {
                script,
                build: await script.build()
              }
            }));

            const fulfilledPromises = promises.reduce<ScriptBuildResult[]>((newArray, promise) => {
              if (promise.status === 'fulfilled') {
                newArray.push(promise.value);
              }

              return newArray
            }, []);

            const argument = fulfilledPromises.map(({ script, build }) => {
              return {
                name: `ts:${script.getNameWithoutExtension()}.d.ts`,
                declaration: build.declaration
              };
            }).concat([
              {
                name: "ts:environment.d.ts",
                declaration: "declare const process: { env: { HELLO: string; }; };"
              }
            ]);

            console.log({ argument });

            this.webviewPanel.webview.postMessage({
              command: "integrationWorkbench.updateScriptDeclarations",
              arguments: [ argument ]
            });

            return;
          }

          case "integrationWorkbench.setHttpRequestParameterAutoRefresh": {
            if(this.request instanceof WorkbenchHttpRequest) {
              const [ enabled ] = message.arguments;

              this.request.data.parametersAutoRefresh = enabled;

              this.request.parent?.save();

              this.updateRequest();
            }

            return;
          }
        }
      },
      undefined,
      this.disposables
    );

    if(request instanceof WorkbenchHttpRequest) {
      this.previewUrl = new RequestPreviewUrlPanel(this, request);
    }
  }

  private updateRequest() {
    this.webviewPanel.webview.postMessage({
      command: "integrationWorkbench.updateRequest",
      arguments: [ this.request.getData() ]
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

    this.request.deleteWebviewPanel();
  }
}