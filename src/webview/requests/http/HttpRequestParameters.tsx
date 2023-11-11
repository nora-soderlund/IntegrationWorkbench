import React, { Component, useEffect, useRef, useState } from "react";
import { HttpRequestProps } from "./HttpRequest";
import { VSCodeButton, VSCodeCheckbox, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDivider, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTag, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import HttpRequestBodySwitch from "./body/HttpRequestBodySwitch";
import { WorkbenchHttpRequestApplicationJsonBodyData, WorkbenchHttpRequestNoneBodyData, WorkbenchHttpRequestRawBodyData } from "../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import HttpRequestParameterScript from "./parameters/HttpRequestParameterScript";

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
        <VSCodeDataGridRow rowType="header" className="data-grid-variables-header-row" style={{
            alignItems: "center"
          }}>
          <VSCodeDataGridCell cellType="columnheader" gridColumn="1">
            Preview
          </VSCodeDataGridCell>

          <VSCodeDataGridCell gridColumn="2" style={{
            display: "flex",
            flexDirection: "row",
            gap: "0.5em",
            justifyContent: "flex-end"
          }}>
            <VSCodeCheckbox checked={requestData.data.parametersAutoRefresh} onClick={(event) => {
              window.vscode.postMessage({
                command: "integrationWorkbench.setHttpRequestParameterAutoRefresh",
                arguments: [ (event.target as HTMLInputElement).checked ]
              });
            }}>
              Auto-refresh
            </VSCodeCheckbox>

            <VSCodeButton appearance="icon" aria-label="Delete" onClick={() => {
              window.vscode.postMessage({
                command: "integrationWorkbench.getHttpRequestPreviewUrl",
                arguments: [ requestData.data.parameters ]
              });
            }}>
              <span className="codicon codicon-refresh"/>
            </VSCodeButton>
          </VSCodeDataGridCell>

          <VSCodeDataGridCell cellType="columnheader" gridColumn="3"></VSCodeDataGridCell>
        </VSCodeDataGridRow>

        <VSCodeDataGridRow className="data-grid-variables-header-row">
          <VSCodeDataGridCell gridColumn="1">
            {(previewUrl)?(
              previewUrl
            ):(
              <i>No preview url available...</i>
            )}
          </VSCodeDataGridCell>

          <VSCodeDataGridCell gridColumn="2"></VSCodeDataGridCell>
          <VSCodeDataGridCell gridColumn="3"></VSCodeDataGridCell>
        </VSCodeDataGridRow>
      </VSCodeDataGrid>

      <VSCodeDivider style={{
        margin: "1em 0"
      }}/>

      {(!requestData.data.parameters.length)?(
        <p>This request has no parameters, <VSCodeLink onClick={() => (
          window.vscode.postMessage({
            command: "integrationWorkbench.changeHttpRequestParameters",
            arguments: [
              [
                ...requestData.data.parameters,
                {
                  name: "",
                  value: "",
                  type: "raw"
                }
              ]
            ]
          })
        )}>click here</VSCodeLink> to add one.</p>
      ):(
        <VSCodeDataGrid className="data-grid-unfocusable data-grid-unhoverable">
          <VSCodeDataGridRow rowType="header" className="data-grid-variables-row" style={{
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
                        value: "",
                        type: "raw"
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
            <VSCodeDataGridRow key={index} className="data-grid-buttons-hoverable data-grid-variables-row">
              <VSCodeDataGridCell gridColumn="1">
                <VSCodeTextField type="text" placeholder="Enter a header..." value={header.name} onChange={(event) => {
                  header.name = (event.target as HTMLInputElement).value;

                  window.vscode.postMessage({
                    command: "integrationWorkbench.changeHttpRequestParameters",
                    arguments: [ requestData.data.parameters ]
                  });
                }}/>
              </VSCodeDataGridCell>

              <VSCodeDataGridCell gridColumn="2" style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5em"
              }}>
                {(header.type === "raw")?(
                  <VSCodeTextField type="text" placeholder="Enter a value..." value={header.value} onChange={(event) => {
                    header.value = (event.target as HTMLInputElement).value;

                    window.vscode.postMessage({
                      command: "integrationWorkbench.changeHttpRequestParameters",
                      arguments: [ requestData.data.parameters ]
                    });
                  }}/>
                ):(
                  <HttpRequestParameterScript value={header.value} onChange={(value) => {
                    header.value = value ?? "";

                    window.vscode.postMessage({
                      command: "integrationWorkbench.changeHttpRequestParameters",
                      arguments: [ requestData.data.parameters ]
                    });
                  }}/>
                )}

                <VSCodeLink onClick={() => {
                  console.log("click!!");
                  
                  switch(header.type) {
                    case "raw": {
                      header.type = "typescript";

                      break;
                    }

                    case "typescript": {
                      header.type = "raw";

                      break;
                    }
                  }

                  window.vscode.postMessage({
                    command: "integrationWorkbench.changeHttpRequestParameters",
                    arguments: [ requestData.data.parameters ]
                  });
                }}>
                  Change to {(header.type === "raw")?("script"):("raw")}
                </VSCodeLink>
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
