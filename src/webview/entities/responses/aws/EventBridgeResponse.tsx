import React from "react";
import { VSCodeButton, VSCodePanelTab, VSCodePanelView, VSCodePanels } from "@vscode/webview-ui-toolkit/react";
import { HandlerErrorState, HandlerState } from "../../../../interfaces/entities/handlers/Handler";
import { WorkbenchEventBridgeRequestData } from "../../../../interfaces/workbenches/requests/aws/WorkbenchEventBridgeRequestData";
import { EventBridgeHandlerFulfilledState } from "../../../../interfaces/entities/handlers/aws/EventBridgeHandlerFulfilledState";
import { EventBridgeHandlerState } from "../../../../interfaces/entities/handlers/aws/EventBridgeHandlerState";
import EventBridgeResponseResult from "./EventBridgeResponseResult";
import EventBridgeResponseRequest from "./EventBridgeResponseRequest";

export type EventBridgeResponseProps = {
  requestData: WorkbenchEventBridgeRequestData;
  handlerState: EventBridgeHandlerState;
};

export default function EventBridgeResponse({ requestData, handlerState }: EventBridgeResponseProps) {
  return (
    <React.Fragment>
      <VSCodePanels style={{
        flex: 1,
        padding: "0 20px"
      }}>
        <VSCodePanelTab>RESULT</VSCodePanelTab>
        <VSCodePanelTab>REQUEST</VSCodePanelTab>

        <VSCodePanelView style={{
          height: "100%",
          flexDirection: "column",
          padding: "0 6px",
          border: "none"
        }}>
          <EventBridgeResponseResult requestData={requestData} handlerState={handlerState}/>
        </VSCodePanelView>

        <VSCodePanelView>
          <EventBridgeResponseRequest requestData={requestData} handlerState={handlerState}/>
        </VSCodePanelView>
      </VSCodePanels>
    </React.Fragment>
  );
}
