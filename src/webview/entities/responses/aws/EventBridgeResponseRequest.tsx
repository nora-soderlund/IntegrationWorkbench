import React, { Component, useRef } from "react";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDivider, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { Editor } from "@monaco-editor/react";
import useMonacoUserTheme from "../../../hooks/useMonacoUserTheme";
import { EventBridgeResponseProps } from "./EventBridgeResponse";

export default function EventBridgeResponseRequest({ requestData, handlerState }: EventBridgeResponseProps) {
  const { theme } = useMonacoUserTheme();

  if(!handlerState.request) {
    return (
      <p>No response result available yet.</p>
    );
  }

  return (
    <div style={{
      width: "100%"
    }}>
      <div>
        <p><b>Region</b></p>
        <p>{handlerState.request.region}</p>
      </div>

      <VSCodeDivider style={{
        margin: "1.5em 0"
      }}/>

      <div>
        <p><b>ARN</b></p>
        <p>{handlerState.request.arn}</p>
      </div>

      <VSCodeDivider style={{
        margin: "1.5em 0"
      }}/>

      <div>
        <p><b>Detail type</b></p>
        <p>{handlerState.request.detailType}</p>
      </div>

      <VSCodeDivider style={{
        margin: "1.5em 0"
      }}/>

      <div>
        <p><b>Event source</b></p>
        <p>{handlerState.request.eventSource}</p>
      </div>

      <VSCodeDivider style={{
        margin: "1.5em 0"
      }}/>

      <div>
        <p><b>Resources</b></p>

        {(!handlerState.request.resources.length)?(
          <p>This request has no resources.</p>
        ):(
          <VSCodeDataGrid className="data-grid-unfocusable data-grid-unhoverable" style={{
            width: "100%"
          }}>
            {handlerState.request.resources.map((value) => (
              <VSCodeDataGridRow key={value} className="data-grid-buttons-hoverable">
                <VSCodeDataGridCell gridColumn="1">
                  {(value.length)?(
                    value
                  ):(
                    <i>No resource value...</i>
                  )}
                </VSCodeDataGridCell>
              </VSCodeDataGridRow>
            ))}
          </VSCodeDataGrid>
        )}
      </div>

      <VSCodeDivider style={{
        margin: "1.5em 0"
      }}/>

      <div>
        <p><b>Body</b></p>

        {(handlerState.request.body?.length)?(
          <div style={{
            flex: 1,
            height: "8em",

            border: "1px solid var(--vscode-editorWidget-border)",
            boxSizing: "border-box"
          }}>
            <Editor value={handlerState.request.body} language="json" theme={theme} options={{
              scrollBeyondLastLine: false,
              minimap: {
                enabled: false
              },
              readOnly: true,
              padding: {
                top: 6,
                bottom: 6
              }
            }}/>
          </div>
        ):(
          <p>This request has no body.</p>
        )}
      </div>
    </div>
  );
};
