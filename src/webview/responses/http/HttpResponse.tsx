import React from "react";
import { VSCodePanelTab, VSCodePanelView, VSCodePanels } from "@vscode/webview-ui-toolkit/react";
import { WorkbenchHttpResponseData } from "../../../interfaces/workbenches/responses/WorkbenchHttpResponseData";
import HttpResponseBodySwitch from "./HttpResponseBodySwitch";
import HttpResponseHeaders from "./HttpResponseHeaders";

export type HttpResponseProps = {
  responseData: WorkbenchHttpResponseData;
};

function getHttpResponseColor(status: number) {
  if(status >= 400) {
    return "darkred";
  }

  return undefined;
}

export default function HttpResponse({ responseData }: HttpResponseProps) {
  return (
    <React.Fragment>
      <VSCodePanels style={{
        flex: 1,
        padding: "0 20px"
      }}>
        <VSCodePanelTab>BODY</VSCodePanelTab>
        <VSCodePanelTab>HEADERS</VSCodePanelTab>

        {(responseData.result) && (
          <VSCodePanelTab style={{
            justifyTracks: "flex-end",
            pointerEvents: "none",
            textTransform: "none",
            color: getHttpResponseColor(responseData.result.status)
          }}>
            Status: {responseData.result.status} {responseData.result.statusText}
          </VSCodePanelTab>
        )}

        <VSCodePanelView style={{
          height: "100%",
          flexDirection: "column",
          padding: "0 6px",
          border: "none"
        }}>
          <HttpResponseBodySwitch responseData={responseData}/>
        </VSCodePanelView>

        <VSCodePanelView>
          <HttpResponseHeaders responseData={responseData}/>
        </VSCodePanelView>
        
        <VSCodePanelView/>
      </VSCodePanels>
    </React.Fragment>
  );
}
