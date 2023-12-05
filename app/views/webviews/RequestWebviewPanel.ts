import { Disposable, ExtensionContext, Uri, ViewColumn, WebviewPanel, TextDocument, window, workspace, commands, ThemeIcon, StatusBarAlignment, StatusBarItem, ThemeColor } from "vscode";
import { getWebviewUri } from "../../utils/GetWebviewUri";
import { readFileSync } from "fs";
import path from "path";
import WorkbenchRequest from "../../entities/requests/WorkbenchRequest";
import WorkbenchHttpRequest from "../../entities/requests/http/WorkbenchHttpRequest";
import Scripts from "../../instances/Scripts";
import Script from "../../entities/scripts/TypescriptScript";
import RequestPreviewUrlPanel from "./requests/RequestPreviewUrlPanel";
import { outputChannel } from "../../extension";
import RequestPreviewHeadersPanel from "./requests/RequestPreviewHeadersPanel";
import Environments from "../../instances/Environments";
import WorkbenchEventBridgeRequest from "../../entities/requests/aws/WorkbenchEventBridgeRequest";

export class RequestWebviewPanel {
  public readonly webviewPanel: WebviewPanel;
  public readonly disposables: Disposable[] = [];

  private previewUrl?: RequestPreviewUrlPanel;
  private previewHeaders?: RequestPreviewHeadersPanel;

  constructor(
    private readonly context: ExtensionContext,
		public readonly request: WorkbenchRequest
  ) {
    this.webviewPanel = window.createWebviewPanel(
      "norasoderlund.integrationworkbench.request",
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

        console.debug("Received event from request webview:", command, message.arguments);

        switch (command) {
          case "norasoderlund.integrationworkbench.showOutputLogs": {
            outputChannel.show();

            break;
          }

          case "norasoderlund.integrationworkbench.changeHttpRequestMethod": {
            const [ method ] = message.arguments;

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setMethod(method);
            }

            this.updateRequest();

            return;
          }

          case "norasoderlund.integrationworkbench.changeHttpRequestUrl": {
            const [ url ] = message.arguments;

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setUrl(url);
            }

            this.updateRequest();

            return;
          }

          case "norasoderlund.integrationworkbench.changeHttpRequestHeaders": {
            const [ headers ] = message.arguments;

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setHeaders(headers);
            }

            this.updateRequest();

            return;
          }

          case "norasoderlund.integrationworkbench.changeHttpRequestParameters": {
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

          case "norasoderlund.integrationworkbench.changeHttpRequestBody": {
            const [ bodyData ] = message.arguments;

            console.log(bodyData);

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setBody(bodyData);
            }

            this.updateRequest();

            return;
          }

          case "norasoderlund.integrationworkbench.changeHttpRequestAuthorization": {
            const [ authorizationData ] = message.arguments;

            if(this.request instanceof WorkbenchHttpRequest) {
              this.request.setAuthorization(authorizationData);
            }

            this.updateRequest();

            return;
          }

          case "norasoderlund.integrationworkbench.sendRequest": {
            this.request.send();

            return;
          }

          case "norasoderlund.integrationworkbench.getRequest": {
            this.updateRequest();

            return;
          }

          case "norasoderlund.integrationworkbench.getScriptDeclarations": {
            await this.updateScriptDeclarations();

            return;
          }

          case "norasoderlund.integrationworkbench.setHttpRequestParameterAutoRefresh": {
            if(this.request instanceof WorkbenchHttpRequest) {
              const [ enabled ] = message.arguments;

              this.request.data.parametersAutoRefresh = enabled;

              this.request.parent?.save();

              this.updateRequest();
            }

            return;
          }

          case "norasoderlund.integrationworkbench.setHttpRequestHeadersAutoRefresh": {
            if(this.request instanceof WorkbenchHttpRequest) {
              const [ enabled ] = message.arguments;

              this.request.data.headersAutoRefresh = enabled;

              this.request.parent?.save();

              this.updateRequest();
            }

            return;
          }

          case "norasoderlund.integrationworkbench.changeEventBridgeBody": {
            if(this.request instanceof WorkbenchEventBridgeRequest) {
              const [ body ] = message.arguments;

              console.log("update", { body });

              this.request.data.body = body;

              console.log("new", { data: this.request.data });

              console.log("parent", { parent: this.request.parent });

              this.request.parent?.save();

              this.updateRequest();
            }

            return;
          }

          case "norasoderlund.integrationworkbench.changeRequestData": {
            const [ requestData ] = message.arguments;

            this.request.data = requestData.data;

            this.request.parent?.save();

            this.updateRequest();

            return;
          }
        }
      },
      undefined,
      this.disposables
    );

    if(request instanceof WorkbenchHttpRequest) {
      this.previewUrl = new RequestPreviewUrlPanel(this, request);
      this.previewHeaders = new RequestPreviewHeadersPanel(this, request);
    }
  }

  public async updateScriptDeclarations() {
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
        declaration: await Environments.getEnvironmentDeclaration()
      }
    ]);

    console.log({ argument });

    this.webviewPanel.webview.postMessage({
      command: "norasoderlund.integrationworkbench.updateScriptDeclarations",
      arguments: [ argument ]
    });
  }

  private updateRequest() {
    this.webviewPanel.webview.postMessage({
      command: "norasoderlund.integrationworkbench.updateRequest",
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

    this.request.webview.deleteWebviewPanel();
  }
}