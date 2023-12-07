// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import WorkbenchTreeDataProvider from './views/trees/workbenches/WorkbenchTreeDataProvider';
import WorkbenchesRequestsTreeDataProvider from './views/trees/responses/WorkbenchesRequestsTreeDataProvider';
import WorkbenchResponseTreeItem from './views/trees/responses/items/WorkbenchResponseTreeItem';
import { ResponseWebviewPanel } from './views/webviews/ResponseWebviewPanel';
import ScriptsTreeDataProvider from './views/trees/scripts/ScriptsTreeDataProvider';
import Scripts from './instances/Scripts';
import Environments from './instances/Environments';
import EnvironmentsTreeDataProvider from './views/trees/environments/EnvironmentsTreeDataProvider';
import Commands from './instances/Commands';
import WorkbenchResponse from './entities/responses/WorkbenchResponse';
import Workbenches from './instances/Workbenches';
import Watcher from './instances/Watcher';

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
		treeDataProvider: workbenchesTreeDataProvider,
		dragAndDropController: workbenchesTreeDataProvider,
		canSelectMany: true
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

	context.subscriptions.push(vscode.commands.registerCommand('norasoderlund.integrationworkbench.showResponse', (workbenchResponseTreeItem: WorkbenchResponseTreeItem) => {
		workbenchesResponsesTreeView.reveal(workbenchResponseTreeItem, {
			select: true
		});

		workbenchResponseWebviewPanel.showResponse(workbenchResponseTreeItem.response);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('norasoderlund.integrationworkbench.refreshResponses', (workbenchResponse: WorkbenchResponse) => {
		console.log("Should refresh responses", { workbenchResponse });

		const workbenchResponseTreeItem = workbenchesResponsesTreeDataProvider.workbenchResponses.find((workbenchTreeView) => workbenchTreeView.response.id === workbenchResponse.id);

		console.log("found", { workbenchResponseTreeItem });

		workbenchResponseTreeItem?.update();

		console.log("refreshing");

		workbenchesResponsesTreeDataProvider.refresh();

		if(workbenchResponseWebviewPanel.currentResponse?.id === workbenchResponse.id) {
			workbenchResponseWebviewPanel.showResponse(workbenchResponse);
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('norasoderlund.integrationworkbench.deleteResponse', (reference: unknown) => {
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
	

	context.subscriptions.push(vscode.commands.registerCommand('norasoderlund.integrationworkbench.refreshWorkbenches', () => {
		workbenchesTreeDataProvider.refresh();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('norasoderlund.integrationworkbench.refreshScripts', () => {
		scriptsTreeDataProvider.refresh();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('norasoderlund.integrationworkbench.refreshEnvironments', () => {
		environmentsTreeDataProvider.refresh();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('norasoderlund.integrationworkbench.addResponse', (workbenchResponse: WorkbenchResponse) => {
		const workbenchResponseTreeItem = new WorkbenchResponseTreeItem(workbenchResponse);

		workbenchesResponsesTreeDataProvider.workbenchResponses.unshift(workbenchResponseTreeItem);
		workbenchesResponsesTreeDataProvider.selectAfterRefresh = workbenchResponseTreeItem;

		workbenchesResponsesTreeDataProvider.refresh();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('norasoderlund.integrationworkbench.openWalkthrough', () => {
		vscode.commands.executeCommand(`workbench.action.openWalkthrough`, `norasoderlund.integrationWorkbench#workbenches.openWorkbenches`, false);
	}));

	Commands.register(context);

	Workbenches.register(context);

	Scripts.scanForScripts();
	Scripts.buildScript("");

	Environments.scan(context);
	Environments.register(context);

	Watcher.register(context);

	//vscode.window.registerTreeDataProvider('workbenches', new WorkbenchTreeDataProvider(rootPath));
}

// This method is called when your extension is deactivated
export function deactivate() {}
