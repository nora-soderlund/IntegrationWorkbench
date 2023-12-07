import { TreeDataProvider, TreeItem, Event, EventEmitter, ExtensionContext, TreeDragAndDropController, CancellationToken, DataTransfer, DataTransferItem } from 'vscode';
import WorkbenchTreeItem from './items/WorkbenchTreeItem';
import WorkbenchRequestTreeItem from './items/WorkbenchRequestTreeItem';
import WorkbenchCollectionTreeItem from './items/WorkbenchCollectionTreeItem';
import Workbenches from '../../../instances/Workbenches';

export default class WorkbenchTreeDataProvider implements TreeDataProvider<WorkbenchTreeItem>, TreeDragAndDropController<WorkbenchTreeItem> {
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
        Workbenches.workbenches.map((workbench) =>
          new WorkbenchTreeItem(workbench)
        )
      );
    }
    else {
      if (element instanceof WorkbenchCollectionTreeItem) {
        return Promise.resolve(
          element.collection.requests.map((request) => {
            const requestTreeItem = new WorkbenchRequestTreeItem(element.workbench, request, element.collection);

            request.webview.treeDataViewItem = requestTreeItem;
          
            return requestTreeItem;
          })
        );
      }
      else if (element instanceof WorkbenchTreeItem) {
        return Promise.resolve([
          ...element.workbench.collections.map((collection) => (
            new WorkbenchCollectionTreeItem(element.workbench, collection)
          )),
          ...element.workbench.requests.map((request) => {
            const requestTreeItem = new WorkbenchRequestTreeItem(element.workbench, request, element.workbench);

            request.webview.treeDataViewItem = requestTreeItem;
          
            return requestTreeItem;
          })
        ]);
      }
    }

    return Promise.resolve([]);
  }

  dropMimeTypes = ['application/vnd.code.tree.workbenches'];
	dragMimeTypes = ['text/uri-list'];

	public async handleDrag(source: WorkbenchTreeItem[], dataTransfer: DataTransfer, token: CancellationToken): Promise<void> {
    dataTransfer.set('application/vnd.code.tree.workbenches', new DataTransferItem(source.map((source) => {
      if(source instanceof WorkbenchRequestTreeItem) {
        return {
          id: source.request.id,
          instance: "request"
        };
      }
      else if(source instanceof WorkbenchCollectionTreeItem) {
        return {
          id: source.collection.id,
          instance: "collection"
        };
      }
      else if(source instanceof WorkbenchTreeItem) {
        return {
          id: source.workbench.id,
          instance: "workbench"
        };
      }
    })));

    console.log("handleDrag", { source, dataTransfer });
  }

  public async handleDrop(target: WorkbenchTreeItem | undefined, dataTransfer: DataTransfer, token: CancellationToken): Promise<void> {
    const transferItem = dataTransfer.get('application/vnd.code.tree.workbenches');
		
    if (!transferItem) {
			return;
		}

    console.log("Drop", { value: transferItem.value });

    if(target instanceof WorkbenchRequestTreeItem) {
    }
    else if(target instanceof WorkbenchCollectionTreeItem) {
      for(let value of transferItem.value) {
        if(value.instance === "request") {
          const request = Workbenches.getRequest(value.id);

          if(!request?.parent) {
            continue;
          }

          console.log("Move request to collection", { request, target });

          const index = request.parent.requests.indexOf(request);
          request.parent.requests.splice(index, 1);
          request.parent.save();

          request.parent = target.collection;
          request.parent.requests.push(request);
        }
      }

      target.collection.save();
    }
    else if(target instanceof WorkbenchTreeItem) {
      for(let value of transferItem.value) {
        if(value.instance === "request") {
          const request = Workbenches.getRequest(value.id);

          if(!request?.parent) {
            continue;
          }

          console.log("Move request to collection", { request, target });

          const index = request.parent.requests.indexOf(request);
          request.parent.requests.splice(index, 1);
          request.parent.save();

          request.parent = target.workbench;
          request.parent.requests.push(request);
        }
      }

      target.workbench.save();
    }

    this.refresh();
  }

  private _onDidChangeTreeData: EventEmitter<WorkbenchTreeItem | undefined | null | void> = new EventEmitter<WorkbenchTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: Event<WorkbenchTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
