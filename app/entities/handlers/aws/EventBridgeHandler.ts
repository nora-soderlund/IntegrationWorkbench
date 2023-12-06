import { commands } from "vscode";
import Handler, { HandlerState } from "~interfaces/entities/handlers/Handler";
import { EventBridgeHandlerFulfilledState } from "../../../../src/interfaces/entities/handlers/aws/EventBridgeHandlerFulfilledState";
import WorkbenchEventBridgeResponse from "../../responses/aws/WorkbenchEventBridgeResponse";
import Environments from "../../../instances/Environments";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import Scripts from "../../../instances/Scripts";
import { outputChannel } from "../../../extension";

export default class EventBridgeHandler implements Handler<EventBridgeHandlerFulfilledState> {
  public state: HandlerState<EventBridgeHandlerFulfilledState> = {
    status: "idle"
  };
  
  constructor(
    private readonly response: WorkbenchEventBridgeResponse
  ) {

  }

  public async execute(abortController: AbortController): Promise<void> {
    try {
      if(!Environments.selectedEnvironment) {
        throw new Error("You must select an environment to use the AWS integrations.");
      }

      if(!this.response.request.data.eventBridgeArn.length) {
        throw new Error("You must enter an EventBus ARN or name.");
      }

      const client = new EventBridgeClient({
        region: "eu-north-1",
        credentials: await Environments.selectedEnvironment.getAwsCredentials()
      });

      const response = await client.send(new PutEventsCommand({
        Entries: [
          {
            Detail: await Scripts.evaluateUserInput(this.response.request.data.body),
            DetailType: await Scripts.evaluateUserInput(this.response.request.data.detailType),
            Source: await Scripts.evaluateUserInput(this.response.request.data.eventSource),
            EventBusName: this.response.request.data.eventBridgeArn,
            Resources: []
          }
        ]
      }));

      if(!response.Entries?.length) {
        throw new Error("Did not receive back any entries from the PutEvents command.");
      }

      const entry = response.Entries[0];

      if(entry.ErrorMessage) {
        throw new Error(entry.ErrorMessage);
      }

      this.state = {
        status: "fulfilled",
        data: {
          eventId: entry.EventId ?? "Unknown"
        }
      };

      commands.executeCommand("norasoderlund.integrationworkbench.refreshResponses", this.response);
    }
    catch(error) {
      this.handleError(error);
    }
  }

  private handleError(error: Error | string | unknown) {
    if(error instanceof Error) {
      this.state = {
        status: "error",
        message: error.message
      };
    }
    else if(typeof error === "string") {
      this.state = {
        status: "error",
        message: error
      };
    }
    else {
      this.state = {
        status: "error",
        message: String(error)
      };
    }

    outputChannel.error(this.state.message);

    commands.executeCommand("norasoderlund.integrationworkbench.refreshResponses", this.response);
  }
}