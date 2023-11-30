import { Command, ExtensionContext, Uri, commands, window, workspace } from "vscode";
import { Workbench } from "../../workbenches/Workbench";
import { RequestWebviewPanel } from "../../panels/RequestWebviewPanel";
import WorkbenchRequest from "../../workbenches/requests/WorkbenchRequest";
import { WorkbenchCollection } from "../../workbenches/collections/WorkbenchCollection";
import Script from "../../scripts/TypescriptScript";

export default class OpenScriptCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.openScript', this.handle.bind(this))
    );
  }
  
  async handle(script: Script) {
    const file = Uri.file(script.filePath);

    const textDocument = await workspace.openTextDocument(file);

    window.showTextDocument(textDocument);
  };
}
