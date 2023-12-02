import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import Environment from "../../../../entities/environments/Environment";
import EnvironmentsTreeDataProvider from "../EnvironmentsTreeDataProvider";

export default class EnvironmentTreeItem extends TreeItem {
  constructor(
    public readonly treeDataProvider: EnvironmentsTreeDataProvider,
    public readonly environment: Environment
  ) {
    super(environment.data.name, TreeItemCollapsibleState.None);

    environment.treeDataViewItem = this;

    this.update();

    this.command = {
      title: "Edit script",
      command: "integrationWorkbench.openEnvironment",
      arguments: [this.environment]
    };
  }

  update() {
    this.label = this.environment.data.name;
    this.description = this.environment.data.description;
    this.contextValue = "environment";

    this.iconPath = new ThemeIcon("server-environment");
  }
}
