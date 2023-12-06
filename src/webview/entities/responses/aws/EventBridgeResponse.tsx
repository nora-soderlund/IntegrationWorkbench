import React from "react";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { HandlerErrorState, HandlerState } from "../../../../interfaces/entities/handlers/Handler";
import { WorkbenchEventBridgeRequestData } from "../../../../interfaces/workbenches/requests/aws/WorkbenchEventBridgeRequestData";
import { EventBridgeHandlerFulfilledState } from "../../../../interfaces/entities/handlers/aws/EventBridgeHandlerFulfilledState";

export type EventBridgeResponseProps = {
  requestData: WorkbenchEventBridgeRequestData;
  handlerState: HandlerState<EventBridgeHandlerFulfilledState>;
};

export default function EventBridgeResponse({ requestData, handlerState }: EventBridgeResponseProps) {
  switch(handlerState.status) {
    case "idle":
    case "started": {
      return (
        <div style={{
          flex: 1,
          padding: "10px 20px"
        }}>
          Loading...
        </div>
      );
    }

    case "fulfilled": {
      return (
        <div style={{
          flex: 1,
          padding: "10px 20px"
        }}>
          <div className="infobox infobox-info">
            <div>
              <i className="codicon codicon-info"></i>{" "}<b>EventBridge event was sent:</b>
              
              <p>
                Event Id: {handlerState.data.eventId}
              </p>
            </div>
          </div>
        </div>
      );
    }

    case "error": {
      return (
        <div style={{
          flex: 1,
          padding: "10px 20px"
        }}>
          <div className="infobox infobox-error">
            <div>
              <i className="codicon codicon-error"></i>{" "}<b>An error occured:</b>
              
              <p>
                {handlerState.message}
              </p>
            </div>
    
            <VSCodeButton onClick={(() => 
              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.showOutputLogs",
                arguments: []
              })
            )} style={{
              width: "max-content"
            }}>
              Show output logs
            </VSCodeButton>
          </div>
        </div>
      );
    }
  }
}
