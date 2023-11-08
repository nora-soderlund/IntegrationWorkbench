import { WebviewApi } from "vscode-webview";
import { WorkbenchHttpRequestData } from "../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import HttpRequestHeader from "./HttpRequestHeader";
import React from "react";
import { VSCodeBadge, VSCodePanelTab, VSCodePanelView, VSCodePanels, VSCodeTag } from "@vscode/webview-ui-toolkit/react";
import HttpRequestBody from "./body/HttpRequestBody";
import HttpRequestHeaders from "./headers/HttpRequestHeaders";
import HttpRequestParameters from "./HttpRequestParameters";
import HttpRequestAuthorization from "./authorization/HttpRequestAuthorization";

export type HttpRequestProps = {
  requestData: WorkbenchHttpRequestData;
}

export default function HttpRequest({ requestData }: HttpRequestProps) {
  return (
    <div style={{
      flex: 1,

      display: "flex",
      flexDirection: "column",
      padding: "0 20px"
    }}>
      <HttpRequestHeader requestData={requestData}/>

      <VSCodePanels style={{
        flex: 1
      }}>
        <VSCodePanelTab>
          BODY
        </VSCodePanelTab>
        
        <VSCodePanelTab>
          HEADERS

          {(requestData.data.headers.length > 0) && (
            <VSCodeBadge>{requestData.data.headers.length}</VSCodeBadge>
          )}
        </VSCodePanelTab>

        <VSCodePanelTab>
          PARAMETERS

          {(requestData.data.parameters.length > 0) && (
            <VSCodeBadge>{requestData.data.parameters.length}</VSCodeBadge>
          )}
        </VSCodePanelTab>
        
        <VSCodePanelTab>AUTHORIZATION</VSCodePanelTab>

        <VSCodePanelTab>SCRIPTS</VSCodePanelTab>

        <VSCodePanelView style={{
          height: "100%",
          flexDirection: "column"
        }}>
          <HttpRequestBody requestData={requestData}/>
        </VSCodePanelView>

        <VSCodePanelView style={{
          flexDirection: "column"
        }}>
          <HttpRequestHeaders requestData={requestData}/>
        </VSCodePanelView>

        <VSCodePanelView style={{
          flexDirection: "column"
        }}>
          <HttpRequestParameters requestData={requestData}/>
        </VSCodePanelView>

        <VSCodePanelView style={{
          flexDirection: "column"
        }}>
          <HttpRequestAuthorization requestData={requestData}/>
        </VSCodePanelView>

        <VSCodePanelView style={{
          flexDirection: "column"
        }}>
        </VSCodePanelView>
      </VSCodePanels>
    </div>
  );
}
