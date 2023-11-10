import { ThemeColor, ThemeIcon, TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import path from "path";
import { existsSync } from "fs";
import { isHttpRequestData } from "../../../../../src/interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import WorkbenchResponse from "../../../responses/WorkbenchHttpResponse";
import Script from "../../../../scripts/Script";

export default class ScriptTreeItem extends TreeItem {
  constructor(
    public readonly script: Script
  ) {
    super(script.name, TreeItemCollapsibleState.None);

    script.treeDataViewItem = this;

    this.tooltip = `${script.name} script`;

    this.update();

    this.command = {
      title: "Edit script",
      command: "integrationWorkbench.openScript",
      arguments: [this.script]
    };
  }

  update() {
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
