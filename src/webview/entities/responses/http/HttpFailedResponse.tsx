import React from "react";
import { VSCodeButton, VSCodePanelTab, VSCodePanelView, VSCodePanels } from "@vscode/webview-ui-toolkit/react";
import { WorkbenchHttpResponseData } from "../../../../interfaces/workbenches/responses/WorkbenchHttpResponseData";
import HttpResponseBodySwitch from "./HttpResponseBodySwitch";
import HttpResponseHeaders from "./HttpResponseHeaders";
import { HttpResponseProps } from "./HttpResponse";
import { WorkbenchHttpRequestData } from "../../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import { HandlerErrorState } from "../../../../interfaces/entities/handlers/Handler";

export type HttpFailedResponseProps = {
  requestData: WorkbenchHttpRequestData;
  handlerState: HandlerErrorState;
}

export default function HttpFailedResponse({ requestData, handlerState }: HttpFailedResponseProps) {
  return (
    <div style={{
      flex: 1,
      padding: "10px 20px"
    }}>
      <div className="infobox infobox-error">
        <div>
          <i className="codicon codicon-error"></i>{" "}<b>An error occured:</b>
          
          <p>
            {handlerState.message}
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
