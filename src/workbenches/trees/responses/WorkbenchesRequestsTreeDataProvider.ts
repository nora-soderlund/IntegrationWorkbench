import { TreeDataProvider, TreeItem, Event, EventEmitter, ExtensionContext } from 'vscode';
import WorkbenchResponseTreeItem from './items/WorkbenchResponseTreeItem';
import { WorkbenchResponse } from '../../responses/WorkbenchResponse';
import WorkbenchResponsesBookmarkTreeItem from './items/WorkbenchResponsesBookmarkTreeItem';

type WrokbenchResponseTreeItems = WorkbenchResponseTreeItem | WorkbenchResponsesBookmarkTreeItem;

export default class WorkbenchesRequestsTreeDataProvider implements TreeDataProvider<WrokbenchResponseTreeItems> {
  public workbenchResponses: WorkbenchResponse[] = [];

  constructor(
    private readonly context: ExtensionContext
  ) {

  }

  getTreeItem(element: WrokbenchResponseTreeItems): TreeItem {
    return element;
  }

  getChildren(element?: WrokbenchResponseTreeItems): Thenable<WrokbenchResponseTreeItems[]> {
    if (!element) {
      return Promise.resolve(
        [
          new WorkbenchResponsesBookmarkTreeItem(),
          ...this.workbenchResponses.map((response) =>
            new WorkbenchResponseTreeItem(response)
          )
        ]
      );
    }

    return Promise.resolve([]);
  }

  private _onDidChangeTreeData: EventEmitter<WrokbenchResponseTreeItems | undefined | null | void> = new EventEmitter<WrokbenchResponseTreeItems | undefined | null | void>();
  readonly onDidChangeTreeData: Event<WrokbenchResponseTreeItems | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
