import { ExtensionContext, commands, window } from "vscode";
import WorkbenchCollectionTreeItem from "../../views/trees/workbenches/items/WorkbenchCollectionTreeItem";
import { randomUUID } from "crypto";
import WorkbenchRequest from "../../entities/requests/WorkbenchRequest";
import WorkbenchHttpRequest from "../../entities/requests/http/WorkbenchHttpRequest";
import WorkbenchTreeItem from "../../views/trees/workbenches/items/WorkbenchTreeItem";
import { Workbench } from "../../entities/workbenches/Workbench";
import { WorkbenchCollection } from "../../entities/collections/WorkbenchCollection";
import WorkbenchEventBridgeRequest from "../../entities/requests/aws/WorkbenchEventBridgeRequest";

export default class CreateRequestCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('norasoderlund.integrationworkbench.createRequest', this.handle.bind(this))
    );
  }
  
  async handle(reference: unknown) {
    const requestType = await window.showQuickPick([
      "HTTP request",
      "AWS EventBridge event",
      //"AWS SNS Topic message"
    ], {
      canPickMany: false,
      title: "Select type of request to create:"
    });

    if(!requestType) {
      return;
    }

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
        switch(requestType) {
          case "HTTP request": {
            workbenchItem.requests.push(
              new WorkbenchHttpRequest(workbenchItem, {
                id: randomUUID(),
                name: value,
                type: "HTTP",
                data: {
                  method: "GET",
                  url: "https://api.integrationbench.com/",
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
                }
              })
            );

            break;
          }

          case "AWS EventBridge event": {
            workbenchItem.requests.push(
              new WorkbenchEventBridgeRequest(workbenchItem, {
                id: randomUUID(),
                name: value,
                type: "EventBridge",
                data: {
                  region: "eu-north-1",
                  eventBridgeArn: "",
                  body: {
                    type: "raw",
                    key: "body",
                    value: "{}"
                  },
                  eventSource: {
                    type: "raw",
                    key: "eventSource",
                    value: ""
                  },
                  detailType: {
                    type: "raw",
                    key: "detailType",
                    value: ""
                  },
                  time: {
                    date: "",
                    time: "",
                    timezone: "local"
                  },
                  resources: [],
                  parameters: [],
                  parametersAutoRefresh: false
                }
              })
            );

            break;
          }

          default: {
            throw new Error("Unknown request type selected.");
          }
        }

        workbenchItem.save();

        commands.executeCommand("norasoderlund.integrationworkbench.refreshWorkbenches");
      }
    });
  }
}
