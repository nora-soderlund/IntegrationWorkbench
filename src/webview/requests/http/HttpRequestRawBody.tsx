import React, { Component, useRef } from "react";
import { HttpRequestProps } from "./HttpRequest";
import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import HttpRequestBodySwitch from "./HttpRequestBodySwitch";
import { WorkbenchHttpRequestRawBodyData } from "../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import { Editor } from "@monaco-editor/react";

type HttpRequestRawBodyProps = HttpRequestProps & {
  requestBodyData: WorkbenchHttpRequestRawBodyData;
};

export default function HttpRequestRawBody({ requestData, requestBodyData }: HttpRequestRawBodyProps) {
  return (
    <div style={{
      height: "100%",
      border: "1px solid var(--vscode-editorWidget-border)",
      boxSizing: "border-box"
    }}>
      <Editor value={requestBodyData.body} theme="vs-dark" options={{
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false
        }
      }} onChange={(value) => (
        window.vscode.postMessage({
          command: "integrationWorkbench.changeHttpRequestBody",
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
