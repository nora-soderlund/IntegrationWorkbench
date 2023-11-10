// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import WorkbenchTreeDataProvider from './workbenches/trees/workbenches/WorkbenchTreeDataProvider';
import { getAllRequestsWithWebviews, scanForWorkbenches, workbenches } from './Workbenches';
import CreateCollectionCommand from './commands/collections/CreateCollectionCommand';
import CreateRequestCommand from './commands/requests/CreateRequestCommand';
import OpenRequestCommand from './commands/requests/OpenRequestCommand';
import CreateWorkbenchCommand from './commands/workbenches/CreateWorkbenchCommand';
import OpenResponseCommand from './commands/responses/OpenResponseCommand';
import { getWebviewUri } from './utils/GetWebviewUri';
import { readFileSync } from 'fs';
import path from 'path';
import WorkbenchesRequestsTreeDataProvider from './workbenches/trees/responses/WorkbenchesRequestsTreeDataProvider';
import { WorkbenchResponse } from './workbenches/responses/WorkbenchResponse';
import EditCollectionNameCommand from './commands/collections/EditCollectionNameCommand';
import EditCollectionDescriptionCommand from './commands/collections/EditCollectionDescriptionCommand';
import EditRequestNameCommand from './commands/requests/EditRequestNameCommand';
import RunCollectionCommand from './commands/collections/RunCollectionCommand';
import RunRequestCommand from './commands/requests/RunRequestCommand';
import WorkbenchResponseTreeItem from './workbenches/trees/responses/items/WorkbenchResponseTreeItem';
import DeleteRequestCommand from './commands/requests/DeleteRequestCommand';
import DeleteCollectionCommand from './commands/collections/DeleteCollectionCommand';
import DeleteWorkbenchCommand from './commands/workbenches/DeleteWorkbenchCommand';
import { ResponseWebviewPanel } from './panels/ResponseWebviewPanel';
import RunWorkbenchCommand from './commands/workbenches/RunWorkbenchCommand';
import ScriptsTreeDataProvider from './workbenches/trees/scripts/ScriptsTreeDataProvider';
import Scripts from './Scripts';
import CreateScriptCommand from './commands/scripts/CreateScriptCommand';
import ScriptTreeItem from './workbenches/trees/scripts/items/ScriptTreeItem';
import OpenScriptCommand from './commands/scripts/OpenScriptCommand';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "integrationworkbench" is now active!');

	const workbenchesTreeDataProvider = new WorkbenchTreeDataProvider(context);
	
	const workbenchTreeView = vscode.window.createTreeView('workbenches', {
		treeDataProvider: workbenchesTreeDataProvider
	});

	const workbenchesResponsesTreeDataProvider = new WorkbenchesRequestsTreeDataProvider(context);
	
	const workbenchesResponsesTreeView = vscode.window.createTreeView('requests', {
		treeDataProvider: workbenchesResponsesTreeDataProvider
	});

	const scriptsTreeDataProvider = new ScriptsTreeDataProvider(context);
	
	const scriptsTreeView = vscode.window.createTreeView('scripts', {
		treeDataProvider: scriptsTreeDataProvider
	});

	const workbenchResponseWebviewPanel = new ResponseWebviewPanel(context);

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.showResponse', (workbenchResponseTreeItem: WorkbenchResponseTreeItem) => {
		workbenchesResponsesTreeView.reveal(workbenchResponseTreeItem, {
			select: true
		});

		workbenchResponseWebviewPanel.showResponse(workbenchResponseTreeItem.response);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refreshResponses', (workbenchResponse: WorkbenchResponse) => {
		const workbenchResponseTreeItem = workbenchesResponsesTreeDataProvider.workbenchResponses.find((workbenchTreeView) => workbenchTreeView.response.id === workbenchResponse.id);

		workbenchResponseTreeItem?.update();

		workbenchesResponsesTreeDataProvider.refresh();

		if(workbenchResponseWebviewPanel.currentResponse?.id === workbenchResponse.id) {
			workbenchResponseWebviewPanel.showResponse(workbenchResponse);
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.deleteResponse', (reference: unknown) => {
		if(reference instanceof WorkbenchResponseTreeItem) {
			const index = workbenchesResponsesTreeDataProvider.workbenchResponses.indexOf(reference);

			if(index !== -1) {
				workbenchesResponsesTreeDataProvider.workbenchResponses.splice(index, 1);

				workbenchesResponsesTreeDataProvider.refresh();

				if(workbenchResponseWebviewPanel.currentResponse?.id === reference.response.id) {
					workbenchResponseWebviewPanel.disposeResponse();
				}
			}
			else {
				vscode.window.showWarningMessage("Failed to find request to delete.");
			}
		}
	}));

	/*vscode.window.registerWebviewViewProvider("response", {
		resolveWebviewView: (webviewView, _context, _token) => {
			webviewView.webview.options = {
				enableScripts: true,
				
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, 'build'),
          vscode.Uri.joinPath(context.extensionUri, 'resources'),
          vscode.Uri.joinPath(context.extensionUri, 'node_modules', '@vscode', 'codicons')
        ]
			};

			const webviewUri = getWebviewUri(webviewView.webview, context.extensionUri, ["build", "webviews", "response.js"]);
			const globalStyleUri = getWebviewUri(webviewView.webview, context.extensionUri, ["resources", "request", "styles", "global.css"]);
			const styleUri = getWebviewUri(webviewView.webview, context.extensionUri, ["resources", "request", "styles", "response.css"]);
			const shikiUri = getWebviewUri(webviewView.webview, context.extensionUri, ["resources", "shiki"]);
			const codiconsUri = getWebviewUri(webviewView.webview, context.extensionUri, [ 'node_modules', '@vscode/codicons', 'dist', 'codicon.css' ]);

			webviewView.webview.html = `
				<!DOCTYPE html>
				<html lang="en">
					<head>
						<meta charset="UTF-8"/>
	
						<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
						
						<title>Hello World!</title>
	
						<link rel="stylesheet" href="${globalStyleUri}"/>
						<link rel="stylesheet" href="${styleUri}"/>
						<link rel="stylesheet" href="${codiconsUri}"/>
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

			let currentWorkbenchResponse: WorkbenchResponse | undefined;

			context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.showResponse', (workbenchResponseTreeItem: WorkbenchResponseTreeItem) => {
				currentWorkbenchResponse = workbenchResponseTreeItem.response;
				
				workbenchesResponsesTreeView.reveal(workbenchResponseTreeItem, {
					select: true
				});

				webviewView.webview.postMessage({
					command: "integrationWorkbench.showResponse",
					arguments: [ workbenchResponseTreeItem.response.getData() ]
				});
			}));

			context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refreshResponses', (workbenchResponse: WorkbenchResponse) => {
				const workbenchResponseTreeItem = workbenchesResponsesTreeDataProvider.workbenchResponses.find((workbenchTreeView) => workbenchTreeView.response.id === workbenchResponse.id);
		
				workbenchResponseTreeItem?.update();
		
				workbenchesResponsesTreeDataProvider.refresh();

				if(currentWorkbenchResponse?.id === workbenchResponse.id) {
					webviewView.webview.postMessage({
						command: "integrationWorkbench.showResponse",
						arguments: [ currentWorkbenchResponse.getData() ]
					});
				}
			}));

			context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.deleteResponse', (reference: unknown) => {
				if(reference instanceof WorkbenchResponseTreeItem) {
					const index = workbenchesResponsesTreeDataProvider.workbenchResponses.indexOf(reference);
		
					if(index !== -1) {
						workbenchesResponsesTreeDataProvider.workbenchResponses.splice(index, 1);
		
						workbenchesResponsesTreeDataProvider.refresh();

						if(currentWorkbenchResponse?.id === reference.response.id) {
							currentWorkbenchResponse = undefined;

							webviewView.webview.postMessage({
								command: "integrationWorkbench.showResponse",
								arguments: [ currentWorkbenchResponse ]
							});
						}
					}
					else {
						vscode.window.showWarningMessage("Failed to find request to delete.");
					}
				}
			}));
		}
	});*/
	
	new CreateCollectionCommand(context);
	new EditCollectionNameCommand(context);
	new EditCollectionDescriptionCommand(context);
	new RunCollectionCommand(context);
	new DeleteCollectionCommand(context);
	
	new CreateRequestCommand(context);
	new OpenRequestCommand(context);
	new EditRequestNameCommand(context);
	new RunRequestCommand(context);
	new DeleteRequestCommand(context);

	new OpenResponseCommand(context);

	new CreateWorkbenchCommand(context);
	new DeleteWorkbenchCommand(context);
	new RunWorkbenchCommand(context);

	new CreateScriptCommand(context);
	new OpenScriptCommand(context);

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refreshWorkbenches', () => {
		workbenchesTreeDataProvider.refresh();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refreshScripts', () => {
		scriptsTreeDataProvider.refresh();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.addResponse', (workbenchResponse: WorkbenchResponse) => {
		const workbenchResponseTreeItem = new WorkbenchResponseTreeItem(workbenchResponse);

		workbenchesResponsesTreeDataProvider.workbenchResponses.unshift(workbenchResponseTreeItem);
		workbenchesResponsesTreeDataProvider.selectAfterRefresh = workbenchResponseTreeItem;

		workbenchesResponsesTreeDataProvider.refresh();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.openWalkthrough', () => {
		vscode.commands.executeCommand(`workbench.action.openWalkthrough`, `nora-soderlund.integrationWorkbench#workbenches.openWorkbenches`, false);
	}));

	scanForWorkbenches(context);
	Scripts.scanForScripts(context);

	//vscode.window.registerTreeDataProvider('workbenches', new WorkbenchTreeDataProvider(rootPath));
}

// This method is called when your extension is deactivated
export function deactivate() {}
