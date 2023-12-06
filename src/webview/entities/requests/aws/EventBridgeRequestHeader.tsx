import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { EventBridgeRequestProps } from "./EventBridgeRequest";

const eventBridgeRegions = [
  "af-south-1",    // Africa (Cape Town) Region
  "ap-east-1",     // Asia Pacific (Hong Kong) Region
  "ap-northeast-1", // Asia Pacific (Tokyo) Region
  "ap-northeast-2", // Asia Pacific (Seoul) Region
  "ap-northeast-3", // Asia Pacific (Osaka) Region
  "ap-south-1",     // Asia Pacific (Mumbai) Region
  "ap-southeast-1", // Asia Pacific (Singapore) Region
  "ap-southeast-2", // Asia Pacific (Sydney) Region
  "ca-central-1",   // Canada (Central) Region
  "eu-central-1",   // Europe (Frankfurt) Region
  "eu-north-1",     // Europe (Stockholm) Region
  "eu-south-1",     // Europe (Milan) Region
  "eu-west-1",      // Europe (Ireland) Region
  "eu-west-2",      // Europe (London) Region
  "eu-west-3",      // Europe (Paris) Region
  "me-south-1",     // Middle East (UAE) Region
  "me-south-2",     // Middle East (Bahrain) Region
  "sa-east-1",      // South America (São Paulo) Region
  "us-east-1",      // US East (N. Virginia) Region
  "us-east-2",      // US East (Ohio) Region
  "us-west-1",      // US West (N. California) Region
  "us-west-2",      // US West (Oregon) Region
  "ap-southeast-3", // Asia Pacific (Jakarta) Region
  "ap-southeast-4"  // Asia Pacific (Melbourne) Region
];

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
        <VSCodeDropdown value={requestData.data.region} onChange={(event) => {
          const value = (event.target as HTMLInputElement).value;

          requestData.data.region = value;

          window.vscode.postMessage({
            command: "norasoderlund.integrationworkbench.changeRequestData",
            arguments: [ requestData ]
          })
        }}>
          {eventBridgeRegions.map((region) => (
            <VSCodeOption key={region} value={region}>{region}</VSCodeOption>
          ))}
        </VSCodeDropdown>

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

        {/*<VSCodeButton appearance="icon" onClick={() => 
          window.vscode.postMessage({
            command: "norasoderlund.integrationworkbench.changeHttpRequestMethod",
            arguments: [ "GET" ]
          })
        }>
          <span className="codicon codicon-list-selection"></span>
        </VSCodeButton>*/}
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
