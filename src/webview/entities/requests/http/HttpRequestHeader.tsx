import { Component, useRef } from "react";
import { HttpRequestProps } from "./HttpRequest";
import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import useDynamicChangeHandler from "../../../hooks/useDynamicChangeHandler";

const defaultHttpRequestMethods = [ 'GET', 'DELETE', 'PATCH', 'PUT', 'POST' ];

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
        {defaultHttpRequestMethods.includes(requestData.data.method)?(
          <VSCodeDropdown value={requestData.data.method} onChange={(event) => (
            window.vscode.postMessage({
              command: "norasoderlund.integrationworkbench.changeHttpRequestMethod",
              arguments: [ (event.target as HTMLInputElement).value ]
            })
          )}>
            {defaultHttpRequestMethods.map((method) => (
              <VSCodeOption key={method}>{method}</VSCodeOption>
            ))}

            <VSCodeOption>CUSTOM</VSCodeOption>
          </VSCodeDropdown>
        ):(
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: "0.5em"
          }}>
            <VSCodeTextField type="text" placeholder="Custom method..." value={requestData.data.method} onChange={useDynamicChangeHandler((value) => 
              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeHttpRequestMethod",
                arguments: [ value ]
              })
            )}/>

            <VSCodeButton appearance="icon" onClick={() => 
              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeHttpRequestMethod",
                arguments: [ "GET" ]
              })
            }>
              <span className="codicon codicon-clear-all"></span>
            </VSCodeButton>
          </div>
        )}

        <VSCodeTextField type="url" placeholder="Enter the URL of this request..." value={requestData.data.url} style={{
          flex: 1
        }} onChange={useDynamicChangeHandler((value) => (
          window.vscode.postMessage({
            command: "norasoderlund.integrationworkbench.changeHttpRequestUrl",
            arguments: [ value ]
          })
        ))}/>
      </div>

      <VSCodeButton className="header-send" onClick={() => (
        window.vscode.postMessage({
          command: "norasoderlund.integrationworkbench.sendRequest",
          arguments: []
        })
      )}>
        Send HTTP Request
      </VSCodeButton>
    </header>
  );
};
