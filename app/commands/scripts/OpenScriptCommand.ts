import { ExtensionContext, Uri, commands, window, workspace } from "vscode";
import { Workbench } from "../../entities/workbenches/Workbench";
import { RequestWebviewPanel } from "../../views/webviews/RequestWebviewPanel";
import WorkbenchRequest from "../../entities/requests/WorkbenchRequest";
import { WorkbenchCollection } from "../../entities/collections/WorkbenchCollection";
import Script from "../../entities/scripts/TypescriptScript";
import Command from "../Command";

export default class OpenScriptCommand extends Command {
  constructor(context: ExtensionContext) {
    super(context, 'integrationWorkbench.openScript');
  }
  
  async handle(script: Script) {
    const file = Uri.file(script.filePath);

    const textDocument = await workspace.openTextDocument(file);

    window.showTextDocument(textDocument);
  };
}
