import React from "react";
import { VSCodePanelTab, VSCodePanelView, VSCodePanels } from "@vscode/webview-ui-toolkit/react";
import { WorkbenchHttpResponseData } from "../../../interfaces/workbenches/responses/WorkbenchHttpResponseData";
import HttpResponseBodySwitch from "./HttpResponseBodySwitch";

export type HttpResponseProps = {
  responseData: WorkbenchHttpResponseData;
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

        <VSCodePanelView style={{
          height: "100%",
          flexDirection: "column",
          padding: "0 6px",
          border: "none"
        }}>
          <HttpResponseBodySwitch responseData={responseData}/>
        </VSCodePanelView>

        <VSCodePanelView>
          <h1>hi</h1>
        </VSCodePanelView>
        
      </VSCodePanels>
    </React.Fragment>
  );
}
