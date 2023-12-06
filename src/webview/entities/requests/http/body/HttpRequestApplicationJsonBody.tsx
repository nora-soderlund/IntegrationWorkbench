import React from "react";
import { HttpRequestProps } from "../HttpRequest";
import { WorkbenchHttpRequestApplicationJsonBodyData } from "../../../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import { Editor } from "@monaco-editor/react";
import useMonacoTheme from "../../../../hooks/useMonacoUserTheme";
import useDynamicChangeHandler from "../../../../hooks/useDynamicChangeHandler";

type HttpRequestApplicationJsonBodyProps = HttpRequestProps & {
  requestBodyData: WorkbenchHttpRequestApplicationJsonBodyData;
};

export default function HttpRequestApplicationJsonBody({ requestData, requestBodyData }: HttpRequestApplicationJsonBodyProps) {
  const { theme } = useMonacoTheme();

  return (
    <div style={{
      height: "100%",
      border: "1px solid var(--vscode-editorWidget-border)",
      boxSizing: "border-box"
    }}>
      <Editor language="json" value={requestBodyData.body} theme={theme} options={{
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false
        }
      }} onChange={(value) => {
        useDynamicChangeHandler((value) => (
          window.vscode.postMessage({
            command: "norasoderlund.integrationworkbench.changeHttpRequestBody",
            arguments: [
              {
                type: "application/json",
                body: value
              }
            ]
          })
        ))(value ?? "");
      }}/>
    </div>
  );
};
