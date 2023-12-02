import { ExtensionContext, commands, window } from "vscode";
import Environments from "../../Environments";

export default class SelectEnvironmentCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.selectEnvironment', this.handle.bind(this))
    );
  }
  
  async handle() {
    if(!Environments.loadedEnvironments.length) {
      window.showInformationMessage("There's no environments, create an environment to get started.", "Create an Environment").then((selection) => {
        if(selection) {
          commands.executeCommand("integrationWorkbench.createEnvironment");
        }
      });

      return;
    }

    const selection = await window.showQuickPick([ "None" ].concat(Environments.loadedEnvironments.map((environment) => environment.data.name)), {
      canPickMany: false,
      title: "Select environment to use:",
    });

    if(!selection) {
      return;
    }

    if(selection === "None") {
      Environments.selectEnvironment(this.context, null);
    }
    else {
      const selectedEnvironment = Environments.loadedEnvironments.find((environment) => environment.data.name === selection);

      if(selectedEnvironment) {
        Environments.selectEnvironment(this.context, selectedEnvironment);
      }
    }
  }
}
