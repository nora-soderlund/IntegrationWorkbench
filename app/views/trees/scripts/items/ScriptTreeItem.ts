import { ThemeColor, ThemeIcon, TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import path from "path";
import { existsSync } from "fs";
import { isHttpRequestData } from "../../../../../src/interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import WorkbenchResponse from "../../../../workbenches/responses/WorkbenchHttpResponse";
import Script from "../../../../scripts/TypescriptScript";
import ScriptsTreeDataProvider from "../ScriptsTreeDataProvider";

export default class ScriptTreeItem extends TreeItem {
  constructor(
    public readonly treeDataProvider: ScriptsTreeDataProvider,
    public readonly script: Script
  ) {
    super(script.getName(), TreeItemCollapsibleState.None);

    script.treeDataViewItem = this;

    this.update();

    this.command = {
      title: "Edit script",
      command: "integrationWorkbench.openScript",
      arguments: [this.script]
    };
  }

  update() {
    this.label = this.script.getName();
    this.contextValue = "script";

    this.iconPath = this.getIconPath();
  }

  getIconPath() {
    const iconPath = path.join(__filename, '..', '..', '..', '..', '..', '..', '..', 'resources', 'icons', 'typescript.svg');

    if (existsSync(iconPath)) {
      return Uri.file(iconPath);
    }
  }
}
