// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import WorkbenchTreeDataProvider from './trees/WorkbenchTreeDataProvider';
import { workbenches } from './mock/workbenches';
import WorkbenchCollectionTreeItem from './trees/items/WorkbenchCollectionTreeItem';
import WorkbenchTreeItem from './trees/items/WorkbenchTreeItem';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "integrationworkbench" is now active!');

	const rootPath =
	vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
		? vscode.workspace.workspaceFolders[0].uri.fsPath
		: undefined;

	const workbenchesTreeDataProvider = new WorkbenchTreeDataProvider(context, rootPath);
	
	const workbenchTreeView = vscode.window.createTreeView('workbenches', {
		treeDataProvider: workbenchesTreeDataProvider
	});

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.dev.createWorkbenches', () => {
		context.workspaceState.update("workbenches", workbenches);

		workbenchesTreeDataProvider.refresh();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.dev.removeWorkbenches', () => {
		context.workspaceState.update("workbenches", []);

		workbenchesTreeDataProvider.refresh();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.createWorkbench', () => {
		vscode.window.showInformationMessage('Create workbench');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.createCollection', (reference) => {
		vscode.window.showInformationMessage('Create collection');

		vscode.window.showInputBox({
			prompt: "Enter a collection name",
			validateInput(value) {
				if(!value.length) {
					return "You must enter a collection name or cancel.";
				}

				return null;
			},
		}).then((value) => {
			if(!value) {
				return;
			}

			if(reference instanceof WorkbenchTreeItem) {
				reference.workbench.collections.push({
					name: value,
					requests: []
				});

				context.workspaceState.update("workbenches", [reference.workbench]);

				workbenchesTreeDataProvider.refresh();
			}
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refresh', () => {
		workbenchesTreeDataProvider.refresh();
	}));

	//vscode.window.registerTreeDataProvider('workbenches', new WorkbenchTreeDataProvider(rootPath));
}

// This method is called when your extension is deactivated
export function deactivate() {}
