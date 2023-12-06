import { commands } from "vscode";
import Handler, { HandlerState } from "~interfaces/entities/handlers/Handler";
import { EventBridgeHandlerFulfilledState } from "../../../../src/interfaces/entities/handlers/aws/EventBridgeHandlerFulfilledState";
import WorkbenchEventBridgeResponse from "../../responses/aws/WorkbenchEventBridgeResponse";
import Environments from "../../../instances/Environments";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import Scripts from "../../../instances/Scripts";
import { outputChannel } from "../../../extension";
import { EventBridgeHandlerState } from "~interfaces/entities/handlers/aws/EventBridgeHandlerState";

export default class EventBridgeHandler implements Handler<EventBridgeHandlerFulfilledState> {
  public state: EventBridgeHandlerState = {
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
        region: this.response.request.data.region,
        credentials: await Environments.selectedEnvironment.getAwsCredentials()
      });

      const arn = await this.response.request.getParsedEventBridgeArn(abortController);
      const detail = await Scripts.evaluateUserInput(this.response.request.data.body);
      const detailType = await Scripts.evaluateUserInput(this.response.request.data.detailType);
      const source = await Scripts.evaluateUserInput(this.response.request.data.eventSource);

      const resources = await Promise.all(this.response.request.data.resources.map(async (resource) => {
        return await Scripts.evaluateUserInput(resource);
      }));

      this.state = {
        status: "started",
        request: {
          region: this.response.request.data.region,
          arn,
          body: detail,
          detailType: detailType,
          eventSource: source,
          resources
        }
      };

      const response = await client.send(new PutEventsCommand({
        Entries: [
          {
            Detail: detail,
            DetailType: detailType,
            Source: source,
            EventBusName: arn,
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
        request: this.state.request,
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
        request: this.state.request,
        message: error.message
      };
    }
    else if(typeof error === "string") {
      this.state = {
        status: "error",
        request: this.state.request,
        message: error
      };
    }
    else {
      this.state = {
        status: "error",
        request: this.state.request,
        message: String(error)
      };
    }

    outputChannel.error(this.state.message);

    commands.executeCommand("norasoderlund.integrationworkbench.refreshResponses", this.response);
  }
}