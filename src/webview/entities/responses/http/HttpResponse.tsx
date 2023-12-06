import React from "react";
import { VSCodePanelTab, VSCodePanelView, VSCodePanels } from "@vscode/webview-ui-toolkit/react";
import { WorkbenchHttpResponseData } from "../../../../interfaces/workbenches/responses/WorkbenchHttpResponseData";
import HttpResponseBodySwitch from "./HttpResponseBodySwitch";
import HttpResponseHeaders from "./HttpResponseHeaders";
import HttpFailedResponse from "./HttpFailedResponse";
import { WorkbenchHttpRequestData } from "../../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import { HandlerState } from "../../../../interfaces/entities/handlers/Handler";
import { HttpHandlerFulfilledState } from "../../../../interfaces/entities/handlers/http/HttpHandlerFulfilledState";
import { HttpHandlerState } from "../../../../interfaces/entities/handlers/http/HttpHandlerState";
import HttpResponseRequest from "./HttpResponseRequest";

export type HttpResponseProps = {
  requestData: WorkbenchHttpRequestData;
  handlerState: HttpHandlerState;
};

function getHttpResponseColor(status: number) {
  if(status >= 400) {
    return "darkred";
  }

  return undefined;
}

export default function HttpResponse({ requestData, handlerState }: HttpResponseProps) {
  if(handlerState.status === "error") {
    return (
      <HttpFailedResponse requestData={requestData} handlerState={handlerState}/>
    );
  }

  return (
    <React.Fragment>
      <VSCodePanels style={{
        flex: 1,
        padding: "0 20px"
      }}>
        <VSCodePanelTab>BODY</VSCodePanelTab>
        <VSCodePanelTab>HEADERS</VSCodePanelTab>
        <VSCodePanelTab>REQUEST</VSCodePanelTab>

        {(handlerState.status === "fulfilled") && (
          <VSCodePanelTab style={{
            justifyTracks: "flex-end",
            pointerEvents: "none",
            textTransform: "none",
            color: getHttpResponseColor(handlerState.data.status)
          }}>
            Status: {handlerState.data.status} {handlerState.data.statusText}
          </VSCodePanelTab>
        )}

        <VSCodePanelView style={{
          height: "100%",
          flexDirection: "column",
          padding: "0 6px",
          border: "none"
        }}>
          <HttpResponseBodySwitch requestData={requestData} handlerState={handlerState}/>
        </VSCodePanelView>

        <VSCodePanelView>
          <HttpResponseHeaders requestData={requestData} handlerState={handlerState}/>
        </VSCodePanelView>
        
        <VSCodePanelView>
          <HttpResponseRequest requestData={requestData} handlerState={handlerState}/>
        </VSCodePanelView>
        
        <VSCodePanelView/>
      </VSCodePanels>
    </React.Fragment>
  );
}
