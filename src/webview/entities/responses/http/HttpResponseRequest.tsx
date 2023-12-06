import React, { Component, useRef } from "react";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDivider, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { WorkbenchHttpRequestApplicationJsonBodyData, WorkbenchHttpRequestNoneBodyData, WorkbenchHttpRequestRawBodyData } from "../../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import { HttpResponseProps } from "./HttpResponse";
import { Editor } from "@monaco-editor/react";
import useMonacoUserTheme from "../../../hooks/useMonacoUserTheme";

export default function HttpResponseRequest({ requestData, handlerState }: HttpResponseProps) {
  const { theme } = useMonacoUserTheme();

  if(!handlerState.request) {
    return (
      <p>No response result available yet.</p>
    );
  }

  console.log({ handlerState });

  const headers = Object.entries(handlerState.request.headers);

  return (
    <div style={{
      width: "100%"
    }}>
      <div>
        <p><b>Method</b></p>
        <p>{handlerState.request.method}</p>
      </div>

      <VSCodeDivider style={{
        margin: "1.5em 0"
      }}/>

      <div>
        <p><b>URL</b></p>
        <p><VSCodeLink href={handlerState.request.url} target="_blank" rel="noreferrer">{handlerState.request.url}</VSCodeLink></p>
      </div>

      <VSCodeDivider style={{
        margin: "1.5em 0"
      }}/>

      <div>
        <p><b>Headers</b></p>

        {(!headers.length)?(
          <p>This request has no headers.</p>
        ):(
          <VSCodeDataGrid className="data-grid-unfocusable data-grid-unhoverable" style={{
            width: "100%"
          }}>
            <VSCodeDataGridRow rowType="header" style={{
              alignItems: "center"
            }}>
              <VSCodeDataGridCell cellType="columnheader" gridColumn="1">
                Header
              </VSCodeDataGridCell>

              <VSCodeDataGridCell cellType="columnheader" gridColumn="2">
                Value
              </VSCodeDataGridCell>
            </VSCodeDataGridRow>

            {headers.map(([ key, value ]) => (
              <VSCodeDataGridRow key={key} className="data-grid-buttons-hoverable">
                <VSCodeDataGridCell gridColumn="1">
                  {key}
                </VSCodeDataGridCell>

                <VSCodeDataGridCell gridColumn="2">
                  {(value.length)?(
                    value
                  ):(
                    <i>No header value...</i>
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
            <Editor value={handlerState.request.body} theme={theme} options={{
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
