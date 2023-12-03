import React, { Component, useRef } from "react";
import { HttpRequestProps } from "../HttpRequest";
import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import HttpRequestBodySwitch from "./HttpRequestBodySwitch";
import { WorkbenchHttpRequestRawBodyData } from "../../../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import { Editor } from "@monaco-editor/react";
import useMonacoUserTheme from "../../../../hooks/useMonacoUserTheme";

type HttpRequestRawBodyProps = HttpRequestProps & {
  requestBodyData: WorkbenchHttpRequestRawBodyData;
};

export default function HttpRequestRawBody({ requestData, requestBodyData }: HttpRequestRawBodyProps) { 
  const { theme } = useMonacoUserTheme();

  return (
    <div style={{
      height: "100%",
      border: "1px solid var(--vscode-editorWidget-border)",
      boxSizing: "border-box"
    }}>
      <Editor value={requestBodyData.body} theme={theme} options={{
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false
        }
      }} onChange={(value) => (
        window.vscode.postMessage({
          command: "norasoderlund.integrationworkbench.changeHttpRequestBody",
          arguments: [
            {
              type: "raw",
              body: value
            }
          ]
        })
      )}/>
    </div>
  );
};
