import React, { Component, useEffect, useRef, useState } from "react";
import { HttpRequestProps } from "./HttpRequest";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import HttpRequestBodySwitch from "./body/HttpRequestBodySwitch";
import { WorkbenchHttpRequestApplicationJsonBodyData, WorkbenchHttpRequestNoneBodyData, WorkbenchHttpRequestRawBodyData } from "../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";

export default function HttpRequestParameters({ requestData }: HttpRequestProps) {
  const [ previewUrl, setPreviewUrl ] = useState<string | undefined>(requestData.data.url);

  useEffect(() => {
    window.addEventListener('message', event => {
      const { command } = event.data;

      switch (command) {
        case 'integrationWorkbench.updateHttpRequestPreviewUrl': {
          const [ previewUrl ] = event.data.arguments;

          setPreviewUrl(previewUrl);
  
          break;
        }
      }
    });

    window.vscode.postMessage({
      command: "integrationWorkbench.getHttpRequestPreviewUrl",
      arguments: []
    });
  }, []);

  return (
    <div>
      <VSCodeDataGrid className="data-grid-unfocusable data-grid-unhoverable">
        <VSCodeDataGridRow rowType="header">
          <VSCodeDataGridCell cellType="columnheader" gridColumn="1">
            Preview
          </VSCodeDataGridCell>
        </VSCodeDataGridRow>

        <VSCodeDataGridRow>
          <VSCodeDataGridCell gridColumn="1">
            {(previewUrl)?(
              previewUrl
            ):(
              <i>No preview url available...</i>
            )}
          </VSCodeDataGridCell>
        </VSCodeDataGridRow>
      </VSCodeDataGrid>

      {(!requestData.data.parameters.length)?(
        <p>This request has no parameters, <VSCodeLink onClick={() => (
          window.vscode.postMessage({
            command: "integrationWorkbench.changeHttpRequestParameters",
            arguments: [
              [
                ...requestData.data.parameters,
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
              Parameter
            </VSCodeDataGridCell>

            <VSCodeDataGridCell cellType="columnheader" gridColumn="2">
              Value
            </VSCodeDataGridCell>

            <VSCodeDataGridCell cellType="columnheader" gridColumn="3">
              <VSCodeButton appearance="icon" aria-label="Add" onClick={() => (
                window.vscode.postMessage({
                  command: "integrationWorkbench.changeHttpRequestParameters",
                  arguments: [
                    [
                      ...requestData.data.parameters,
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

          {requestData.data.parameters.map((header, index) => (
            <VSCodeDataGridRow key={index} className="data-grid-buttons-hoverable">
              <VSCodeDataGridCell gridColumn="1">
                <VSCodeTextField type="text" placeholder="Enter a header..." value={header.name} onChange={(event) => {
                  header.name = (event.target as HTMLInputElement).value;

                  window.vscode.postMessage({
                    command: "integrationWorkbench.changeHttpRequestParameters",
                    arguments: [ requestData.data.parameters ]
                  });
                }}/>
              </VSCodeDataGridCell>

              <VSCodeDataGridCell gridColumn="2">
                <VSCodeTextField type="text" placeholder="Enter a value..." value={header.value} onChange={(event) => {
                  header.value = (event.target as HTMLInputElement).value;

                  window.vscode.postMessage({
                    command: "integrationWorkbench.changeHttpRequestParameters",
                    arguments: [ requestData.data.parameters ]
                  });
                }}/>
              </VSCodeDataGridCell>

              <VSCodeDataGridCell gridColumn="3">
                <VSCodeButton appearance="icon" aria-label="Delete" onClick={() => {
                  requestData.data.parameters.splice(index, 1);

                  window.vscode.postMessage({
                    command: "integrationWorkbench.changeHttpRequestParameters",
                    arguments: [ requestData.data.parameters ]
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
