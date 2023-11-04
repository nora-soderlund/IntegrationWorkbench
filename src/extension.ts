// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import WorkbenchTreeDataProvider from './trees/WorkbenchTreeDataProvider';
import { scanForWorkbenches } from './Workbenches';
import CreateCollectionCommand from './commands/collections/CreateCollectionCommand';
import CreateRequestCommand from './commands/requests/CreateRequestCommand';
import OpenRequestCommand from './commands/requests/OpenRequestCommand';
import CreateWorkbenchCommand from './commands/workbenches/CreateWorkbenchCommand';
import OpenResponseCommand from './commands/responses/OpenResponseCommand';
import { getWebviewUri } from './utils/GetWebviewUri';
import { readFileSync } from 'fs';
import path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "integrationworkbench" is now active!');

	const workbenchesTreeDataProvider = new WorkbenchTreeDataProvider(context);

	vscode.window.registerWebviewViewProvider("response", {
		resolveWebviewView: (webviewView, _context, _token) => {
			webviewView.webview.options = {
				enableScripts: true,
				
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, 'build'),
          vscode.Uri.joinPath(context.extensionUri, 'resources')
        ]
			};

			const webviewUri = getWebviewUri(webviewView.webview, context.extensionUri, ["build", "webviews", "response.js"]);
			const styleUri = getWebviewUri(webviewView.webview, context.extensionUri, ["resources", "request", "styles", "response.css"]);
			const shikiUri = getWebviewUri(webviewView.webview, context.extensionUri, ["resources", "shiki"]);

			webviewView.webview.html = `
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
							path.join(__filename, "..", "..", "resources", "request", "response.html"),
							{
								encoding: "utf-8"
							}
						)}
	
						<script type="text/javascript">
							window.shikiUri = "${shikiUri}";
							window.activeColorThemeKind = "${vscode.window.activeColorTheme.kind}";
						</script>
	
						<script type="module" src="${webviewUri}"></script>
					</body>
				</html>
			`;
		}
	});
	
	const workbenchTreeView = vscode.window.createTreeView('workbenches', {
		treeDataProvider: workbenchesTreeDataProvider
	});
	
	new CreateCollectionCommand(context);
	
	new CreateRequestCommand(context);
	new OpenRequestCommand(context);

	new OpenResponseCommand(context);

	new CreateWorkbenchCommand(context);

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refreshWorkbenches', () => {
		workbenchesTreeDataProvider.refresh();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.openWalkthrough', () => {
		vscode.commands.executeCommand(`workbench.action.openWalkthrough`, `nora-soderlund.integrationWorkbench#workbenches.openWorkbenches`, false);
	}));

	scanForWorkbenches(context);

	//vscode.window.registerTreeDataProvider('workbenches', new WorkbenchTreeDataProvider(rootPath));
}

// This method is called when your extension is deactivated
export function deactivate() {}
