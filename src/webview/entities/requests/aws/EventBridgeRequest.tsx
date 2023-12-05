import React from "react";
import { VSCodeBadge, VSCodePanelTab, VSCodePanelView, VSCodePanels, VSCodeTag } from "@vscode/webview-ui-toolkit/react";
import { WorkbenchEventBridgeRequestData } from "../../../../interfaces/workbenches/requests/aws/WorkbenchEventBridgeRequestData";
import EventBridgeRequestHeader from "./EventBridgeRequestHeader";
import EventBridgeRequestBody from "./EventBridgeRequestBody";
import EventBridgeRequestParameters from "./EventBridgeRequestParameters";
import EventBridgeRequestEvent from "./EventBridgeRequestEvent";

export type EventBridgeRequestProps = {
  requestData: WorkbenchEventBridgeRequestData;
};

export default function EventBridgeRequest({ requestData }: EventBridgeRequestProps) {
  return (
    <div style={{
      flex: 1,

      display: "flex",
      flexDirection: "column",
      padding: "0 20px"
    }}>
      <EventBridgeRequestHeader requestData={requestData}/>

      <VSCodePanels style={{
        flex: 1
      }}>
        <VSCodePanelTab>
          EVENT
        </VSCodePanelTab>

        <VSCodePanelTab>
          BODY
        </VSCodePanelTab>

        <VSCodePanelTab>
          PARAMETERS

          {(requestData.data.parameters.length > 0) && (
            <VSCodeBadge>{requestData.data.parameters.length}</VSCodeBadge>
          )}
        </VSCodePanelTab>
        
        <VSCodePanelView style={{
          height: "100%",
          flexDirection: "column"
        }}>
          <EventBridgeRequestEvent requestData={requestData}/>
        </VSCodePanelView>

        
        <VSCodePanelView style={{
          height: "100%",
          flexDirection: "column"
        }}>
          <EventBridgeRequestBody requestData={requestData}/>
        </VSCodePanelView>

        <VSCodePanelView style={{
          flexDirection: "column"
        }}>
          <EventBridgeRequestParameters requestData={requestData}/>
        </VSCodePanelView>
      </VSCodePanels>
    </div>
  );
}
