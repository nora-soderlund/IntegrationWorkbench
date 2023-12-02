import { Disposable, ExtensionContext, ThemeIcon, Uri, ViewColumn, WebviewPanel, window, workspace } from "vscode";
import EnvironmentPreviewVariablesPanel from "./previews/EnvironmentPreviewVariablesPanel";
import Environment from "../../../entities/Environment";
import { readFileSync } from "fs";
import path from "path";
import { getWebviewUri } from "../../../utils/GetWebviewUri";
import { outputChannel } from "../../../extension";
import TypescriptScript from "../../../scripts/TypescriptScript";
import Scripts from "../../../Scripts";
import Environments from "../../../Environments";

export class EnvironmentWebviewPanel {
  public readonly webviewPanel: WebviewPanel;
  public readonly disposables: Disposable[] = [];

  private previewVariables: EnvironmentPreviewVariablesPanel;

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
          case "integrationWorkbench.showOutputLogs": {
            outputChannel.show();

            break;
          }

          case "integrationWorkbench.getEnvironment": {
            this.updateEnvironment();

            return;
          }

          case "integrationWorkbench.changeEnvironmentVariables": {
            const [ variables ] = message.arguments;

            this.environment.data.variables = variables;
            this.environment.save();

            if(this.environment.data.variablesAutoRefresh) {
              this.previewVariables.updatePreviewVariables();
            }

            this.updateEnvironment();

            return;
          }

          case "integrationWorkbench.getScriptDeclarations": {
            type ScriptBuildResult = {
              script: TypescriptScript,
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
              command: "integrationWorkbench.updateScriptDeclarations",
              arguments: [ argument ]
            });

            return;
          }

          case "integrationWorkbench.changeEnvironmentVariablesFile": {
            const selections = await window.showOpenDialog({
              canSelectFiles: true,
              canSelectFolders: false,
              canSelectMany: false,
              openLabel: "Select",
              title: "Select .env file to use for this environment:"
            });

            if(!selections?.length) {
              return;
            }

            const selection = selections[0];

            this.environment.data.variablesFilePath = selection.fsPath;

            this.environment.save();

            this.updateEnvironment();

            break;
          }

          case "integrationWorkbench.removeEnvironmentVariablesFile": {
            delete this.environment.data.variablesFilePath;

            this.environment.save();

            this.updateEnvironment();

            break;
          }

          case "integrationWorkbench.openEnvironmentVariablesFile": {
            if(this.environment.data.variablesFilePath) {
              const file = Uri.file(this.environment.data.variablesFilePath);
        
              const textDocument = await workspace.openTextDocument(file);
          
              window.showTextDocument(textDocument);
            }

            break;
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