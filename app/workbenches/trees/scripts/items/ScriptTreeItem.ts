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

    this.tooltip = `${script.name} script`;

    this.update();

    this.command = {
      title: "Edit script",
      command: "integrationWorkbench.editScript",
      arguments: [this]
    };
  }

  update() {
    this.contextValue = "script";

    this.iconPath = this.getIconPath();
    this.resourceUri = Uri.parse('_.js');
  }

  getIconPath() {
    return ThemeIcon.File;
  }
}
