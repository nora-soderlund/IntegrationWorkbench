import React from "react";
import { VSCodePanelTab, VSCodePanelView, VSCodePanels } from "@vscode/webview-ui-toolkit/react";
import { WorkbenchHttpResponseData } from "../../../interfaces/workbenches/responses/WorkbenchHttpResponseData";
import HttpResponseBodySwitch from "./HttpResponseBodySwitch";
import HttpResponseHeaders from "./HttpResponseHeaders";
import { HttpResponseProps } from "./HttpResponse";

export default function HttpFailedResponse({ responseData }: HttpResponseProps) {
  return (
    <React.Fragment>
      <VSCodePanels style={{
        flex: 1,
        padding: "0 20px"
      }}>
        <VSCodePanelTab>ERRORS</VSCodePanelTab>

        <VSCodePanelView>
          <div className="infobox infobox-error">
            <i className="codicon codicon-error"></i>

            Request failed programmatically with error: {responseData.error}
          </div>
        </VSCodePanelView>
      </VSCodePanels>
    </React.Fragment>
  );
}
