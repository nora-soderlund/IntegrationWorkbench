import { ExtensionContext, commands, window } from "vscode";

export default class Command {
  constructor(
    public readonly context: ExtensionContext,
    public readonly command: string
  ) {
    context.subscriptions.push(
      commands.registerCommand(command, this.handle.bind(this))
    );
  }
  
  async handle(...args: any[]): Promise<any> {
    throw new Error("Not implemented");
  };
}
