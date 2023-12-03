import { ThemeColor, ThemeIcon, TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import path from "path";
import { existsSync } from "fs";
import Script from "../../../../entities/scripts/TypescriptScript";
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
      command: "norasoderlund.integrationworkbench.openScript",
      arguments: [this.script]
    };
  }

  update() {
    this.label = this.script.getName();
    this.contextValue = "script";

    this.iconPath = this.getIconPath();
  }

  getIconPath() {
    const iconPath = path.join(__filename, '..', '..', '..', '..', '..', '..', '..', 'resources', 'icons', 'typescript.png');

    if (existsSync(iconPath)) {
      return Uri.file(iconPath);
    }
  }
}
