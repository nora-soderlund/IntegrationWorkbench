import { ExtensionContext, commands, window } from "vscode";
import Environment from "../../entities/Environment";
import EnvironmentTreeItem from "../../views/trees/environments/items/EnvironmentTreeItem";
import Environments from "../../Environments";

export default class DeleteEnvironmentCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.deleteEnvironment', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    let environment: Environment;

    if(reference instanceof EnvironmentTreeItem) {
      environment = reference.environment;
    }
    else {
      throw new Error("Unknown entry point for deleting environment.");
    }

    environment.delete();

    Environments.scan();
  }
}