import React, { useEffect, useState } from "react";
import { HttpRequestProps } from "./HttpRequest";
import { VSCodeButton, VSCodeCheckbox, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDivider, VSCodeLink } from '@vscode/webview-ui-toolkit/react';
import { WorkbenchHttpRequestPreviewUrlData } from "../../../interfaces/workbenches/requests/WorkbenchHttpRequestPreviewUrlData";
import KeyValueTable from "../../components/KeyValueTable";

export default function HttpRequestParameters({ requestData }: HttpRequestProps) {
  const [ previewUrlData, setPreviewUrlData ] = useState<WorkbenchHttpRequestPreviewUrlData | null>(null);

  useEffect(() => {
    window.addEventListener('message', event => {
      const { command } = event.data;

      switch (command) {
        case 'integrationWorkbench.updateHttpRequestPreviewUrl': {
          const [ previewUrlData ]: [ WorkbenchHttpRequestPreviewUrlData ] = event.data.arguments;

          setPreviewUrlData(previewUrlData);
  
          break;
        }
      }
    });

    if(requestData.data.parametersAutoRefresh) {
      window.vscode.postMessage({
        command: "integrationWorkbench.getHttpRequestPreviewUrl",
        arguments: []
      });
    }
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
      </VSCodeDataGrid>

      {(!previewUrlData)?(
        <p>
          <i>No preview available yet...</i>
        </p>
      ):(
        (previewUrlData.success)?(
          <p>{previewUrlData.url}</p>
        ):(
          <div className="infobox infobox-error" style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "0.5em"
          }}>
            <i className="codicon codicon-error"></i>{" "}Preview failed after {Math.round(previewUrlData.duration)}ms...
            
            <VSCodeButton onClick={(() => 
              window.vscode.postMessage({
                command: "integrationWorkbench.showOutputLogs",
                arguments: []
              })
            )} style={{
              marginLeft: "auto"
            }}>
              Show output logs
            </VSCodeButton>
          </div>
        )
      )}

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
          items={requestData.data.parameters}
          onAdd={() => (
            window.vscode.postMessage({
              command: "integrationWorkbench.changeHttpRequestParameters",
              arguments: [
                [
                  ...requestData.data.parameters,
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
              command: "integrationWorkbench.changeHttpRequestParameters",
              arguments: [ requestData.data.parameters ]
            })
          }}
          onDelete={(item) => {
            const index = requestData.data.parameters.indexOf(item);

            requestData.data.parameters.splice(index, 1);

            window.vscode.postMessage({
              command: "integrationWorkbench.changeHttpRequestParameters",
              arguments: [ requestData.data.parameters ]
            });
          }}
        />
      )}
    </div>
  );
};
