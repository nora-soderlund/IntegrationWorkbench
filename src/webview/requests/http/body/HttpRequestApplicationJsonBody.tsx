import React from "react";
import { HttpRequestProps } from "../HttpRequest";
import { WorkbenchHttpRequestApplicationJsonBodyData } from "../../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import { Editor } from "@monaco-editor/react";

type HttpRequestApplicationJsonBodyProps = HttpRequestProps & {
  requestBodyData: WorkbenchHttpRequestApplicationJsonBodyData;
};

export default function HttpRequestApplicationJsonBody({ requestData, requestBodyData }: HttpRequestApplicationJsonBodyProps) {
  return (
    <div style={{
      height: "100%",
      border: "1px solid var(--vscode-editorWidget-border)",
      boxSizing: "border-box"
    }}>
      <Editor language="json" value={requestBodyData.body} theme="vs-dark" options={{
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false
        }
      }} onChange={(value) => (
        window.vscode.postMessage({
          command: "integrationWorkbench.changeHttpRequestBody",
          arguments: [
            {
              type: "application/json",
              body: value
            }
          ]
        })
      )}/>
    </div>
  );
};
