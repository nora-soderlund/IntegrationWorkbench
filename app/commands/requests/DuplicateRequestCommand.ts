import { ExtensionContext, commands, window } from "vscode";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import { randomUUID } from "crypto";
import WorkbenchRequestTreeItem from "../../views/trees/workbenches/items/WorkbenchRequestTreeItem";
import WorkbenchRequest from "../../entities/requests/WorkbenchRequest";
import WorkbenchHttpRequest from "../../entities/requests/http/WorkbenchHttpRequest";
import WorkbenchEventBridgeRequest from "../../entities/requests/aws/WorkbenchEventBridgeRequest";

export default class DuplicateRequestCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('norasoderlund.integrationworkbench.duplicateRequest', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    let request: WorkbenchRequest;

    if(reference instanceof WorkbenchRequestTreeItem) {
      request = reference.request;
    }
    else {
      throw new Error("Unknown entry point for duplicating request.");
    }

    window.showInputBox({
      prompt: "Enter a request name",
      value: `${request.name} - copy`,
      validateInput(value) {
        if(!value.length) {
          return "You must enter a request name or cancel.";
        }

        return null;
      },
    }).then((value) => {
      if(!value) {
        return;
      }

      if(!request.parent) {
        return;
      }

      if(request instanceof WorkbenchHttpRequest) {
        request.parent.requests.push(
          new WorkbenchHttpRequest(request.parent, {
            id: randomUUID(),
            name: value,
            type: "HTTP",
            data: request.getData().data
          })
        );
      }
      else if(request instanceof WorkbenchEventBridgeRequest) {
        request.parent.requests.push(
          new WorkbenchEventBridgeRequest(request.parent, {
            id: randomUUID(),
            name: value,
            type: "EventBridge",
            data: request.getData().data
          })
        );
      }

      request.parent.save();

      commands.executeCommand("norasoderlund.integrationworkbench.refreshWorkbenches");
    });
  }
}
