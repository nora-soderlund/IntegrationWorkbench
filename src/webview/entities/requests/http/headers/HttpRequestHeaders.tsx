import React, { Component, useEffect, useRef, useState } from "react";
import { HttpRequestProps } from "../HttpRequest";
import { VSCodeButton, VSCodeCheckbox, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDivider, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import KeyValueTable from "../../../../components/KeyValueTable";
import { WorkbenchHttpRequestPreviewHeadersData } from "../../../../../interfaces/workbenches/requests/WorkbenchHttpRequestPreviewHeadersData";

export default function HttpRequestHeaders({ requestData }: HttpRequestProps) {
  const [ previewHeaderData, setPreviewHeaderData ] = useState<WorkbenchHttpRequestPreviewHeadersData | null>(null);

  useEffect(() => {
    window.addEventListener('message', event => {
      const { command } = event.data;

      switch (command) {
        case 'integrationWorkbench.updateHttpRequestPreviewHeaders': {
          const [ previewHeaderData ]: [ WorkbenchHttpRequestPreviewHeadersData ] = event.data.arguments;

          setPreviewHeaderData(previewHeaderData);
  
          break;
        }
      }
    });

    if(requestData.data.parametersAutoRefresh) {
      window.vscode.postMessage({
        command: "integrationWorkbench.getHttpRequestPreviewHeaders",
        arguments: []
      });
    }
  }, []);

  return (
    <div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5em"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}>
          <b>Preview</b>

          <div style={{
            marginLeft: "auto",
            display: "flex",
            flexDirection: "row",
            gap: "0.5em",
            justifyContent: "flex-end"
          }}>
            <VSCodeCheckbox checked={requestData.data.headersAutoRefresh} onClick={(event) => {
              window.vscode.postMessage({
                command: "integrationWorkbench.setHttpRequestHeadersAutoRefresh",
                arguments: [ (event.target as HTMLInputElement).checked ]
              });
            }}>
              Auto-refresh
            </VSCodeCheckbox>

            <VSCodeButton appearance="icon" aria-label="Delete" onClick={() => {
              window.vscode.postMessage({
                command: "integrationWorkbench.getHttpRequestPreviewHeaders",
                arguments: [ requestData.data.headers ]
              });
            }}>
              <span className="codicon codicon-refresh"/>
            </VSCodeButton>
          </div>
        </div>

        {(!previewHeaderData)?(
          <div>
            <p><i>No preview available yet.</i></p>
          </div>
        ):(
          (previewHeaderData.success)?(
            (previewHeaderData.headers.length)?(
              <React.Fragment>
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

                  {previewHeaderData.headers.map(({ key, value }) => (
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

                <VSCodeButton appearance="secondary" onClick={() => setPreviewHeaderData(null)} style={{
                  marginRight: "auto"
                }}>
                  Dismiss preview
                </VSCodeButton>
              </React.Fragment>
            ):(
              <p>This request has no headers.</p>
            )
          ):(
            <div className="infobox infobox-error">
              <div>
                <i className="codicon codicon-error"></i>{" "}<b>An error occured after {Math.round(previewHeaderData.duration)}ms:</b>
                
                {(previewHeaderData.error) && (
                  <p>
                    {previewHeaderData.error}
                  </p>
                )}
              </div>

              <VSCodeButton onClick={(() => 
                window.vscode.postMessage({
                  command: "integrationWorkbench.showOutputLogs",
                  arguments: []
                })
              )} style={{
                width: "max-content"
              }}>
                Show output logs
              </VSCodeButton>
            </div>
          )
        )}
      </div>

      <VSCodeDivider style={{
        margin: "1em 0"
      }}/>

      {(!requestData.data.headers.length)?(
        <p>This request has no headers, <VSCodeLink onClick={() => (
          window.vscode.postMessage({
            command: "integrationWorkbench.changeHttpRequestHeaders",
            arguments: [
              [
                ...requestData.data.headers,
                {
                  key: "",
                  value: "",
                  type: "raw"
                }
              ]
            ]
          })
        )}>click here</VSCodeLink> to add one.</p>
      ):(
        <KeyValueTable
          items={requestData.data.headers}
          onAdd={() => (
            window.vscode.postMessage({
              command: "integrationWorkbench.changeHttpRequestHeaders",
              arguments: [
                [
                  ...requestData.data.headers,
                  {
                    key: "",
                    value: "",
                    type: "raw"
                  }
                ]
              ]
            })
          )}
          onChange={(item) => {
            window.vscode.postMessage({
              command: "integrationWorkbench.changeHttpRequestHeaders",
              arguments: [ requestData.data.headers ]
            })
          }}
          onDelete={(item) => {
            const index = requestData.data.headers.indexOf(item);

            requestData.data.headers.splice(index, 1);

            window.vscode.postMessage({
              command: "integrationWorkbench.changeHttpRequestHeaders",
              arguments: [ requestData.data.headers ]
            });
          }}
        />
      )}
    </div>
  );
};
