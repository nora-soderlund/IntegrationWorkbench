import { TreeDataProvider, TreeItem, Event, EventEmitter, ExtensionContext, commands, ProviderResult } from 'vscode';
import ScriptTreeItem from './items/ScriptTreeItem';
import { WorkbenchResponse } from '../../../workbenches/responses/WorkbenchResponse';
import Scripts from '../../../Scripts';


export default class ScriptsTreeDataProvider implements TreeDataProvider<ScriptTreeItem> {
  public selectAfterRefresh?: ScriptTreeItem;

  constructor(
    private readonly context: ExtensionContext
  ) {

  }

  getParent(element: ScriptTreeItem): ProviderResult<ScriptTreeItem> {
    return null;
  }

  getTreeItem(element: ScriptTreeItem): TreeItem {
    return element;
  }

  getChildren(element?: ScriptTreeItem): Thenable<ScriptTreeItem[]> {
    if(this.selectAfterRefresh) {
      commands.executeCommand("integrationWorkbench.editScript", this.selectAfterRefresh);

      delete this.selectAfterRefresh;
    }

    if (!element) {
      return Promise.resolve(
        Scripts.loadedScripts.map((script) =>
          new ScriptTreeItem(this, script)
        )
      );
    }

    return Promise.resolve([]);
  }

  private _onDidChangeTreeData: EventEmitter<ScriptTreeItem | undefined | null | void> = new EventEmitter<ScriptTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: Event<ScriptTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}