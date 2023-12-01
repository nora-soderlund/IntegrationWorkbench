import React from "react";
import { VSCodeButton, VSCodePanelTab, VSCodePanelView, VSCodePanels } from "@vscode/webview-ui-toolkit/react";
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
            <div>
              <i className="codicon codicon-error"></i>{" "}<b>An error occured:</b>
              
              <p>
                {responseData.error}
              </p>
            </div>

            <VSCodeButton onClick={(() => 
              window.vscode.postMessage({
                command: "integrationWorkbench.showOutputLogs",
                arguments: []
              })
            )} style={{
              width: "max-content"
            }}>
              Show output logs
            </VSCodeButton>
          </div>
        </VSCodePanelView>
      </VSCodePanels>
    </React.Fragment>
  );
}
