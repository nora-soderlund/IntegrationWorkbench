import { window, TreeDataProvider, TreeItem, Event, EventEmitter, ExtensionContext } from 'vscode';
import WorkbenchTreeItem from './items/WorkbenchTreeItem';
import WorkbenchRequestTreeItem from './items/WorkbenchRequestTreeItem';
import WorkbenchCollectionTreeItem from './items/WorkbenchCollectionTreeItem';
import { Workbench } from '../interfaces/workbenches/Workbench';

export default class WorkbenchTreeDataProvider implements TreeDataProvider<WorkbenchTreeItem> {
  constructor(
    private readonly context: ExtensionContext,
    private readonly workspaceRoot?: string
  ) {

  }

  getTreeItem(element: WorkbenchTreeItem): TreeItem {
    return element;
  }

  getChildren(element?: WorkbenchTreeItem): Thenable<WorkbenchTreeItem[]> {
    if (!this.workspaceRoot) {
      window.showInformationMessage('Empty workspace');
    }

    if (!element) {
      const workbenches = this.context.workspaceState.get<Workbench[]>("workbenches");

      if(!workbenches) {
        return Promise.resolve([]);
      }

      return Promise.resolve(
        workbenches.map((workbench) =>
          new WorkbenchTreeItem(workbench)
        )
      );
    }
    else {
      if (element instanceof WorkbenchCollectionTreeItem) {
        return Promise.resolve(
          element.collection.requests.map((request) => (
            new WorkbenchRequestTreeItem(element.workbench, request, element.collection)
          ))
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
