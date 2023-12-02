// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import WorkbenchTreeDataProvider from './views/trees/workbenches/WorkbenchTreeDataProvider';
import { getAllRequestsWithWebviews, scanForWorkbenches, workbenches } from './instances/Workbenches';
import CreateCollectionCommand from './commands/collections/CreateCollectionCommand';
import CreateRequestCommand from './commands/requests/CreateRequestCommand';
import OpenRequestCommand from './commands/requests/OpenRequestCommand';
import CreateWorkbenchCommand from './commands/workbenches/CreateWorkbenchCommand';
import OpenResponseCommand from './commands/responses/OpenResponseCommand';
import { getWebviewUri } from './utils/GetWebviewUri';
import { readFileSync } from 'fs';
import path from 'path';
import WorkbenchesRequestsTreeDataProvider from './views/trees/responses/WorkbenchesRequestsTreeDataProvider';
import { WorkbenchResponse } from './entities/responses/WorkbenchResponse';
import EditCollectionNameCommand from './commands/collections/EditCollectionNameCommand';
import EditCollectionDescriptionCommand from './commands/collections/EditCollectionDescriptionCommand';
import EditRequestNameCommand from './commands/requests/EditRequestNameCommand';
import RunCollectionCommand from './commands/collections/RunCollectionCommand';
import RunRequestCommand from './commands/requests/RunRequestCommand';
import WorkbenchResponseTreeItem from './views/trees/responses/items/WorkbenchResponseTreeItem';
import DeleteRequestCommand from './commands/requests/DeleteRequestCommand';
import DeleteCollectionCommand from './commands/collections/DeleteCollectionCommand';
import DeleteWorkbenchCommand from './commands/workbenches/DeleteWorkbenchCommand';
import { ResponseWebviewPanel } from './views/webviews/ResponseWebviewPanel';
import RunWorkbenchCommand from './commands/workbenches/RunWorkbenchCommand';
import ScriptsTreeDataProvider from './views/trees/scripts/ScriptsTreeDataProvider';
import Scripts from './instances/Scripts';
import CreateScriptCommand from './commands/scripts/CreateScriptCommand';
import OpenScriptCommand from './commands/scripts/OpenScriptCommand';
import EditScriptNameCommand from './commands/scripts/EditScriptNameCommand';
import EditWorkbenchNameCommand from './commands/workbenches/EditWorkbenchNameCommand';
import EditWorkbenchDescriptionCommand from './commands/workbenches/EditWorkbenchDescriptionCommand';
import DeleteScriptCommand from './commands/scripts/DeleteScriptCommand';
import CancelResponseCommand from './commands/responses/CancelResponseCommand';
import Environments from './instances/Environments';
import CreateEnvironmentCommand from './commands/environments/CreateEnvironmentCommand';
import EnvironmentsTreeDataProvider from './views/trees/environments/EnvironmentsTreeDataProvider';
import DeleteEnvironmentCommand from './commands/environments/DeleteEnvironmentCommand';
import EditEnvironmentNameCommand from './commands/environments/EditEnvironmentNameCommand';
import EditEnvironmentDescriptionCommand from './commands/environments/EditEnvironmentDescriptionCommand';
import SelectEnvironmentCommand from './commands/environments/SelectEnvironmentCommand';
import OpenEnvironmentCommand from './commands/environments/OpenEnvironmentCommand';
import Commands from './instances/Commands';

export const outputChannel = vscode.window.createOutputChannel("Integration Workbench", {
	log: true
});

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

	const environmentsTreeDataProvider = new EnvironmentsTreeDataProvider(context);
	
	const environmentsTreeView = vscode.window.createTreeView('environments', {
		treeDataProvider: environmentsTreeDataProvider
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
	

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refreshWorkbenches', () => {
		workbenchesTreeDataProvider.refresh();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refreshScripts', () => {
		scriptsTreeDataProvider.refresh();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('integrationWorkbench.refreshEnvironments', () => {
		environmentsTreeDataProvider.refresh();
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

	Commands.register(context);

	scanForWorkbenches(context);

	Scripts.scanForScripts();
	Scripts.buildScript("");

	Environments.scan();
	Environments.register(context);

	//vscode.window.registerTreeDataProvider('workbenches', new WorkbenchTreeDataProvider(rootPath));
}

// This method is called when your extension is deactivated
export function deactivate() {}
