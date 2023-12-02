import { Component, useRef } from "react";
import { HttpRequestProps } from "./HttpRequest";
import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';

export default function HttpRequestHeader({ requestData }: HttpRequestProps) {
  const urlTextFieldRef = useRef<HTMLInputElement>(null);

  return (
    <header style={{
      padding: "1em 0",

      display: "flex",
      flexDirection: "row",
      gap: "1em"
    }}>
      <div style={{
        flex: 1,

        display: "flex",
        flexDirection: "row",
        gap: "1em"
      }}>
        <VSCodeDropdown value={requestData.data.method} onChange={(event) => (
          window.vscode.postMessage({
            command: "norasoderlund.integrationworkbench.changeHttpRequestMethod",
            arguments: [ (event.target as HTMLInputElement).value ]
          })
        )}>
          <VSCodeOption>GET</VSCodeOption>
          <VSCodeOption>DELETE</VSCodeOption>
          <VSCodeOption>PATCH</VSCodeOption>
          <VSCodeOption>PUT</VSCodeOption>
          <VSCodeOption>POST</VSCodeOption>
        </VSCodeDropdown>

        <VSCodeTextField type="url" placeholder="Enter the URL of this request..." value={requestData.data.url} style={{
          flex: 1
        }} onChange={(event) => (
          window.vscode.postMessage({
            command: "norasoderlund.integrationworkbench.changeHttpRequestUrl",
            arguments: [ (event.target as HTMLInputElement).value ]
          })
        )}/>
      </div>

      <VSCodeButton className="header-send" onClick={() => (
        window.vscode.postMessage({
          command: "norasoderlund.integrationworkbench.sendHttpRequest",
          arguments: []
        })
      )}>
        Send HTTP Request
      </VSCodeButton>
    </header>
  );
};
