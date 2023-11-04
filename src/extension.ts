// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import WorkbenchTreeDataProvider from './trees/WorkbenchTreeDataProvider';
import WorkbenchCollectionTreeItem from './trees/items/WorkbenchCollectionTreeItem';
import WorkbenchTreeItem from './trees/items/WorkbenchTreeItem';
import getWorkbenchStorageOption from './utils/GetWorkbenchStorageOption';
import getUniqueFolderPath from './utils/GetUniqueFolderPath';
import getCamelizedString from './utils/GetCamelizedString';
import { Workbench } from './interfaces/workbenches/Workbench';
import { scanForWorkbenches, workbenches } from './Workbenches';
import { randomUUID } from 'crypto';
import getRootPath from './utils/GetRootPath';
import path from 'path';
import { WorkbenchRequest } from './interfaces/workbenches/requests/WorkbenchRequest';
import { WorkbenchCollection } from './interfaces/workbenches/collections/WorkbenchCollection';
import { readFileSync } from 'fs';
import { getWebviewUri } from './utils/GetWebviewUri';
import getWebviewNonce from './utils/GetWebviewNonce';
import { RequestWebviewPanel } from './panels/RequestWebviewPanel';

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

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.createWorkbench', async () => {
		vscode.window.showInformationMessage('Create workbench');

		const name = await vscode.window.showInputBox({
			placeHolder: "Enter the name of this workbench:",

			validateInput(value) {
				if(!value.length) {
					return "You must enter a name for this workbench!";
				}

				return null;
			},
		});

		if(!name) {
			return;
		}

		const storageOption = await getWorkbenchStorageOption(context, name);

		if(!storageOption) {
			return;
		}

		const uniqueWorkbenchPath = getUniqueFolderPath(storageOption.path, getCamelizedString(name));

		if(!uniqueWorkbenchPath) {
			vscode.window.showErrorMessage("There is too many workbenches with the same name in this storage option, please choose a different name.");
	
			return null;
		}

		const rootPath = getRootPath();

		const workbench = new Workbench({
			name,
			storage: {
				location: storageOption.location,
				base: (rootPath)?(path.basename(rootPath)):(undefined)
			},
			collections: []
		}, uniqueWorkbenchPath);

		workbench.save();

		workbenches.push(workbench);

		workbenchesTreeDataProvider.refresh();
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

				reference.workbench.save();

				workbenchesTreeDataProvider.refresh();
			}
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.createRequest', (reference) => {
		vscode.window.showInformationMessage('Create request');

		vscode.window.showInputBox({
			prompt: "Enter the request name",
			validateInput(value) {
				if(!value.length) {
					return "You must enter a name or cancel.";
				}

				return null;
			},
		}).then((value) => {
			if(!value) {
				return;
			}

			if(reference instanceof WorkbenchCollectionTreeItem) {
				reference.collection.requests.push({
					id: randomUUID(),
					name: value,
					type: null
				});

				reference.workbench.save();

				workbenchesTreeDataProvider.refresh();
			}
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.openRequest', (
		workbench: Workbench,
		request: WorkbenchRequest,
		collection?: WorkbenchCollection
		) => {
		if(!request.webviewPanel) {
			request.webviewPanel = new RequestWebviewPanel(context, workbench, request, collection);
		}
		else {
			request.webviewPanel.reveal();
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refresh', () => {
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
