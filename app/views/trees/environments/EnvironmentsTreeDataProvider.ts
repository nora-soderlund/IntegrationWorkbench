import { TreeDataProvider, TreeItem, Event, EventEmitter, ExtensionContext, commands, ProviderResult } from 'vscode';
import EnvironmentTreeItem from './items/EnvironmentTreeItem';
import Environments from '../../../Environments';

export default class EnvironmentsTreeDataProvider implements TreeDataProvider<EnvironmentTreeItem> {
  public selectAfterRefresh?: EnvironmentTreeItem;

  constructor(
    private readonly context: ExtensionContext
  ) {

  }

  getParent(element: EnvironmentTreeItem): ProviderResult<EnvironmentTreeItem> {
    return null;
  }

  getTreeItem(element: EnvironmentTreeItem): TreeItem {
    return element;
  }

  getChildren(element?: EnvironmentTreeItem): Thenable<EnvironmentTreeItem[]> {
    if(this.selectAfterRefresh) {
      commands.executeCommand("integrationWorkbench.openEnvironment", this.selectAfterRefresh);

      delete this.selectAfterRefresh;
    }

    if (!element) {
      return Promise.resolve(
        Environments.loadedEnvironments.map((environment) =>
          new EnvironmentTreeItem(this, environment)
        )
      );
    }

    return Promise.resolve([]);
  }

  private _onDidChangeTreeData: EventEmitter<EnvironmentTreeItem | undefined | null | void> = new EventEmitter<EnvironmentTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: Event<EnvironmentTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
