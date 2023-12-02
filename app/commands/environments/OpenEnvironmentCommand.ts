import { ExtensionContext, commands } from "vscode";
import Environment from "../../entities/Environment";

export default class OpenEnvironmentCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.openEnvironment', this.handle.bind(this))
    );
  }
  
  async handle(
    environment: Environment
  ) {
    environment.showWebviewPanel(this.context);
  };
}
