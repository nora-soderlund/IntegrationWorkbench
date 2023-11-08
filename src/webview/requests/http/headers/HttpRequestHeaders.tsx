import React, { Component, useRef } from "react";
import { HttpRequestProps } from "../HttpRequest";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import HttpRequestBodySwitch from "../body/HttpRequestBodySwitch";
import { WorkbenchHttpRequestApplicationJsonBodyData, WorkbenchHttpRequestNoneBodyData, WorkbenchHttpRequestRawBodyData } from "../../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";

export default function HttpRequestHeaders({ requestData }: HttpRequestProps) {
  return (
    <div>
      {(!requestData.data.headers.length)?(
        <p>This request has no headers, <VSCodeLink onClick={() => (
          window.vscode.postMessage({
            command: "integrationWorkbench.changeHttpRequestHeaders",
            arguments: [
              [
                ...requestData.data.headers,
                {
                  name: "",
                  value: ""
                }
              ]
            ]
          })
        )}>click here</VSCodeLink> to add one.</p>
      ):(
        <VSCodeDataGrid className="data-grid-unfocusable data-grid-unhoverable">
        <VSCodeDataGridRow rowType="header" style={{
          alignItems: "center"
        }}>
          <VSCodeDataGridCell cellType="columnheader" gridColumn="1">
            Header
          </VSCodeDataGridCell>

          <VSCodeDataGridCell cellType="columnheader" gridColumn="2">
            Value
          </VSCodeDataGridCell>

          <VSCodeDataGridCell cellType="columnheader" gridColumn="3">
            <VSCodeButton appearance="icon" aria-label="Add" onClick={() => (
              window.vscode.postMessage({
                command: "integrationWorkbench.changeHttpRequestHeaders",
                arguments: [
                  [
                    ...requestData.data.headers,
                    {
                      name: "",
                      value: ""
                    }
                  ]
                ]
              })
            )}>
              <span className="codicon codicon-add"/>
            </VSCodeButton>
          </VSCodeDataGridCell>
        </VSCodeDataGridRow>

        {requestData.data.headers.map((header, index) => (
          <VSCodeDataGridRow key={index} className="data-grid-buttons-hoverable">
            <VSCodeDataGridCell gridColumn="1">
              <VSCodeTextField type="text" placeholder="Enter a header..." value={header.name} onChange={(event) => {
                header.name = (event.target as HTMLInputElement).value;

                window.vscode.postMessage({
                  command: "integrationWorkbench.changeHttpRequestHeaders",
                  arguments: [ requestData.data.headers ]
                });
              }}/>
            </VSCodeDataGridCell>

            <VSCodeDataGridCell gridColumn="2">
              <VSCodeTextField type="text" placeholder="Enter a value..." value={header.value} onChange={(event) => {
                header.value = (event.target as HTMLInputElement).value;

                window.vscode.postMessage({
                  command: "integrationWorkbench.changeHttpRequestHeaders",
                  arguments: [ requestData.data.headers ]
                });
              }}/>
            </VSCodeDataGridCell>

            <VSCodeDataGridCell gridColumn="3">
              <VSCodeButton appearance="icon" aria-label="Delete" onClick={() => {
                requestData.data.headers.splice(index, 1);

                window.vscode.postMessage({
                  command: "integrationWorkbench.changeHttpRequestHeaders",
                  arguments: [ requestData.data.headers ]
                });
              }}>
                <span className="codicon codicon-trashcan"/>
              </VSCodeButton>
            </VSCodeDataGridCell>
          </VSCodeDataGridRow>
        ))}
      </VSCodeDataGrid>
      )}
    </div>
  );
};
