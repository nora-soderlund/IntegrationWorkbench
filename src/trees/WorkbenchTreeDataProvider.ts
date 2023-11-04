import { TreeDataProvider, TreeItem, Event, EventEmitter, ExtensionContext } from 'vscode';
import WorkbenchTreeItem from './items/WorkbenchTreeItem';
import WorkbenchRequestTreeItem from './items/WorkbenchRequestTreeItem';
import WorkbenchCollectionTreeItem from './items/WorkbenchCollectionTreeItem';
import { scanForWorkbenches } from '../Workbenches';

export default class WorkbenchTreeDataProvider implements TreeDataProvider<WorkbenchTreeItem> {
  constructor(
    private readonly context: ExtensionContext
  ) {

  }

  getTreeItem(element: WorkbenchTreeItem): TreeItem {
    return element;
  }

  getChildren(element?: WorkbenchTreeItem): Thenable<WorkbenchTreeItem[]> {
    if (!element) {
      return Promise.resolve(
        scanForWorkbenches(this.context, false).map((workbench) =>
          new WorkbenchTreeItem(workbench)
        )
      );
    }
    else {
      if (element instanceof WorkbenchCollectionTreeItem) {
        return Promise.resolve(
          element.collection.requests.map((request) => {
            const requestTreeItem = new WorkbenchRequestTreeItem(element.workbench, request, element.collection);

            request.treeDataViewItems.push(requestTreeItem);
          
            return requestTreeItem;
          })
        );
      }
      else if (element instanceof WorkbenchTreeItem) {
        return Promise.resolve(
          element.workbench.collections.map((collection) => (
            new WorkbenchCollectionTreeItem(element.workbench, collection)
          ))
        );
      }
    }

    return Promise.resolve([]);
  }

  private _onDidChangeTreeData: EventEmitter<WorkbenchTreeItem | undefined | null | void> = new EventEmitter<WorkbenchTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: Event<WorkbenchTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
