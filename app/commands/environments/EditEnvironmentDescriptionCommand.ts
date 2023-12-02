import { ExtensionContext, commands, window } from "vscode";
import Environment from "../../entities/environments/Environment";
import EnvironmentTreeItem from "../../views/trees/environments/items/EnvironmentTreeItem";

export default class EditEnvironmentDescriptionCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('norasoderlund.integrationworkbench.editEnvironmentDescription', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    let environment: Environment;

    if(reference instanceof EnvironmentTreeItem) {
      environment = reference.environment;
    }
    else {
      throw new Error("Unknown entry point for editing environment description.");
    }

    window.showInputBox({
      prompt: "Enter a environment description",
      value: environment.data.description
    }).then((description) => {
      environment.data.description = description;

      environment.save();

      commands.executeCommand("norasoderlund.integrationworkbench.refreshEnvironments");
    });
  }
}
