import { VSCodeButton, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { EventBridgeRequestProps } from "./EventBridgeRequest";

export default function EventBridgeRequestHeader({ requestData }: EventBridgeRequestProps) {
  return (
    <header style={{
      padding: "1em 0",

      display: "flex",
      flexDirection: "row",
      gap: "1em"
    }}>
      <div style={{
        flex: 1,

        display: "flex",
        flexDirection: "row",
        gap: "1em"
      }}>
        <VSCodeTextField type="url" placeholder="Enter the ARN for this request..." value={requestData.data.eventBridgeArn} style={{
          flex: 1
        }} onChange={(event) => {
          const value = (event.target as HTMLInputElement).value;

          requestData.data.eventBridgeArn = value;

          window.vscode.postMessage({
            command: "norasoderlund.integrationworkbench.changeRequestData",
            arguments: [ requestData ]
          })
        }}/>
      </div>

      <VSCodeButton className="header-send" onClick={() => (
        window.vscode.postMessage({
          command: "norasoderlund.integrationworkbench.sendRequest",
          arguments: []
        })
      )}>
        Send EventBus Event
      </VSCodeButton>
    </header>
  );
};
