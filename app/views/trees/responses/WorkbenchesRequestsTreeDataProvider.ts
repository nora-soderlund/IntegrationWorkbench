import { TreeDataProvider, TreeItem, Event, EventEmitter, ExtensionContext, commands, ProviderResult } from 'vscode';
import WorkbenchResponseTreeItem from './items/WorkbenchResponseTreeItem';
import { WorkbenchResponse } from '../../../entities/responses/WorkbenchResponse';
import WorkbenchResponsesBookmarkTreeItem from './items/WorkbenchResponsesBookmarkTreeItem';

type WorkbenchResponseTreeItems = WorkbenchResponseTreeItem | WorkbenchResponsesBookmarkTreeItem;

export default class WorkbenchesRequestsTreeDataProvider implements TreeDataProvider<WorkbenchResponseTreeItems> {
  public workbenchResponses: WorkbenchResponseTreeItem[] = [];
  public selectAfterRefresh?: WorkbenchResponseTreeItem;

  constructor(
    private readonly context: ExtensionContext
  ) {

  }

  getParent(element: WorkbenchResponseTreeItems): ProviderResult<WorkbenchResponseTreeItems> {
    return null;
  }

  getTreeItem(element: WorkbenchResponseTreeItems): TreeItem {
    return element;
  }

  getChildren(element?: WorkbenchResponseTreeItems): Thenable<WorkbenchResponseTreeItems[]> {
    if(this.selectAfterRefresh) {
      commands.executeCommand("norasoderlund.integrationworkbench.showResponse", this.selectAfterRefresh);

      delete this.selectAfterRefresh;
    }

    if (!element) {
      return Promise.resolve(
        [
          //new WorkbenchResponsesBookmarkTreeItem(),
          ...this.workbenchResponses
        ]
      );
    }

    return Promise.resolve([]);
  }

  private _onDidChangeTreeData: EventEmitter<WorkbenchResponseTreeItems | undefined | null | void> = new EventEmitter<WorkbenchResponseTreeItems | undefined | null | void>();
  readonly onDidChangeTreeData: Event<WorkbenchResponseTreeItems | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
