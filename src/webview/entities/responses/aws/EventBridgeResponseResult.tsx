import React from "react";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { EventBridgeResponseProps } from "./EventBridgeResponse";

export default function EventBridgeResponseResult({ requestData, handlerState }: EventBridgeResponseProps) {
  switch(handlerState.status) {
    case "idle":
    case "started": {
      return (
        <div style={{
          flex: 1,
          padding: "10px 0"
        }}>
          Loading...
        </div>
      );
    }

    case "fulfilled": {
      return (
        <div style={{
          flex: 1,
          padding: "10px 0"
        }}>
          <div className="infobox infobox-info">
            <div>
              <i className="codicon codicon-info"></i>{" "}<b>Event was sent:</b>
              
              <p>
                {handlerState.data.eventId}
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
          padding: "10px 0"
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
