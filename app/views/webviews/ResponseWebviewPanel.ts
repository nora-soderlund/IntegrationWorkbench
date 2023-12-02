import { Disposable, ExtensionContext, Uri, ViewColumn, WebviewPanel, TextDocument, window, workspace, commands, ThemeIcon, WebviewView } from "vscode";
import { getWebviewUri } from "../../utils/GetWebviewUri";
import { readFileSync } from "fs";
import path from "path";
import WorkbenchRequest from "../../workbenches/requests/WorkbenchRequest";
import WorkbenchHttpRequest from "../../workbenches/requests/WorkbenchHttpRequest";
import { WorkbenchResponse } from "../../workbenches/responses/WorkbenchResponse";
import { outputChannel } from "../../extension";

export class ResponseWebviewPanel {
  private readonly disposables: Disposable[] = [];
  private webviewView?: WebviewView;
  public currentResponse?: WorkbenchResponse;

  constructor(
    private readonly context: ExtensionContext
  ) {
    window.registerWebviewViewProvider("response", {
      resolveWebviewView: (webviewView, _context, _token) => {
        this.webviewView = webviewView;

        this.webviewView.webview.options = {
          enableScripts: true,
          
          localResourceRoots: [
            Uri.joinPath(context.extensionUri, 'build'),
            Uri.joinPath(context.extensionUri, 'resources'),
            Uri.joinPath(context.extensionUri, 'node_modules', 'monaco-editor', 'min', 'vs'),
            Uri.joinPath(context.extensionUri, 'node_modules', '@vscode', 'codicons')
          ]
        };

        const manifest = JSON.parse(readFileSync(path.join(context.extensionPath, 'build', 'asset-manifest.json'), {
          encoding: "utf-8"
        }));

        const webviewUri = getWebviewUri(this.webviewView.webview, context.extensionUri, ["build", manifest['files']['main.js']]);
        const globalStyleUri = getWebviewUri(this.webviewView.webview, context.extensionUri, ["resources", "request", "styles", "global.css"]);
        const monacoEditorLoaderUri = getWebviewUri(this.webviewView.webview, context.extensionUri, ["node_modules", "monaco-editor", 'min', 'vs', 'loader.js']);
        const codiconsUri = getWebviewUri(this.webviewView.webview, context.extensionUri, [ 'node_modules', '@vscode/codicons', 'dist', 'codicon.css' ]);

        this.webviewView.webview.html = `
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
                
                window.type = "response";
              </script>

              <script src="${monacoEditorLoaderUri}"></script>

              <script src="${webviewUri}"></script>
            </body>
          </html>
        `;

        this.webviewView.webview.onDidReceiveMessage(
          (message: any) => {
            const command = message.command;

            console.debug("Received event from response webview:", command);

            switch (command) {
              case "integrationWorkbench.changeHttpRequestMethod": {
                const [] = message.arguments;

                return;
              }

              case "integrationWorkbench.showOutputLogs": {
                outputChannel.show();
    
                break;
              }
            }
          },
        undefined,
        this.disposables
        );

        if(this.currentResponse) {
          this.showResponse(this.currentResponse);
        }
      }
    });
  }

  showResponse(response: WorkbenchResponse) {
    this.currentResponse = response;

    if(!this.webviewView) {
      return;
    }

    this.webviewView.webview.postMessage({
      command: "integrationWorkbench.showResponse",
      arguments: [ this.currentResponse.getData() ]
    });
  }

  disposeResponse() {
    delete this.currentResponse;

    if(!this.webviewView) {
      return;
    }

    this.webviewView.webview.postMessage({
      command: "integrationWorkbench.showResponse",
      arguments: [ null ]
    });
  }
}