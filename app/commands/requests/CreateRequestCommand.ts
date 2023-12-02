import { ExtensionContext, commands, window } from "vscode";
import WorkbenchCollectionTreeItem from "../../views/trees/workbenches/items/WorkbenchCollectionTreeItem";
import { randomUUID } from "crypto";
import WorkbenchRequest from "../../entities/requests/WorkbenchRequest";
import WorkbenchHttpRequest from "../../entities/requests/WorkbenchHttpRequest";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import { Workbench } from "../../entities/workbenches/Workbench";
import { WorkbenchCollection } from "../../entities/collections/WorkbenchCollection";

export default class CreateRequestCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.createRequest', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    window.showInformationMessage('Create request');

    window.showInputBox({
      prompt: "Enter the request name",
      validateInput(value) {
        if(!value.length) {
          return "You must enter a name or cancel.";
        }

        return null;
      },
    }).then((value) => {
      if(!value) {
        return;
      }

      let workbenchItem: Workbench | WorkbenchCollection | undefined;

      if(reference instanceof WorkbenchTreeItem) {
        workbenchItem = reference.workbench;
      }
      else if(reference instanceof WorkbenchCollectionTreeItem) {
        workbenchItem = reference.collection;
      }

      if(workbenchItem) {
        workbenchItem.requests.push(
          new WorkbenchHttpRequest(workbenchItem, randomUUID(), value, {
            method: "GET",
            url: "https://httpbin.org/get",
            parameters: [],
            parametersAutoRefresh: false,
            authorization: {
              type: "none"
            },
            headers: [],
            headersAutoRefresh: false,
            body: {
              type: "none"
            }
          })
        );

        workbenchItem.save();

        commands.executeCommand("integrationWorkbench.refreshWorkbenches");
      }
    });
  }
}
