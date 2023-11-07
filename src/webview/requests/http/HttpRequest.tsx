import { WebviewApi } from "vscode-webview";
import { WorkbenchHttpRequestData } from "../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import HttpRequestHeader from "./HttpRequestHeader";
import React from "react";
import { VSCodePanelTab, VSCodePanelView, VSCodePanels } from "@vscode/webview-ui-toolkit/react";
import HttpRequestBody from "./HttpRequestBody";
import HttpRequestHeaders from "./HttpRequestHeaders";
import HttpRequestParameters from "./HttpRequestParameters";
import HttpRequestAuthorization from "./HttpRequestAuthorization";

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
        <VSCodePanelTab>BODY</VSCodePanelTab>
        <VSCodePanelTab>HEADERS</VSCodePanelTab>
        <VSCodePanelTab>PARAMETERS</VSCodePanelTab>
        <VSCodePanelTab>AUTHORIZATION</VSCodePanelTab>

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
      </VSCodePanels>
    </div>
  );
}
