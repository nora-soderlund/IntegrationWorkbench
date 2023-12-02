import React from "react";
import { VSCodeButton, VSCodePanelTab, VSCodePanelView, VSCodePanels } from "@vscode/webview-ui-toolkit/react";
import { WorkbenchHttpResponseData } from "../../../../interfaces/workbenches/responses/WorkbenchHttpResponseData";
import HttpResponseBodySwitch from "./HttpResponseBodySwitch";
import HttpResponseHeaders from "./HttpResponseHeaders";
import { HttpResponseProps } from "./HttpResponse";

export default function HttpFailedResponse({ responseData }: HttpResponseProps) {
  return (
    <div style={{
      flex: 1,
      padding: "10px 20px"
    }}>
      <div className="infobox infobox-error">
        <div>
          <i className="codicon codicon-error"></i>{" "}<b>An error occured:</b>
          
          <p>
            {responseData.error}
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
