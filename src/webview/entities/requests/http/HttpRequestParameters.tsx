import React, { useEffect, useState } from "react";
import { HttpRequestProps } from "./HttpRequest";
import { VSCodeButton, VSCodeCheckbox, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDivider, VSCodeLink } from '@vscode/webview-ui-toolkit/react';
import { WorkbenchHttpRequestPreviewUrlData } from "../../../../interfaces/workbenches/requests/WorkbenchHttpRequestPreviewUrlData";
import KeyValueTable from "../../../components/KeyValueTable";

export default function HttpRequestParameters({ requestData }: HttpRequestProps) {
  const [ previewUrlData, setPreviewUrlData ] = useState<WorkbenchHttpRequestPreviewUrlData | null>(null);

  useEffect(() => {
    window.addEventListener('message', event => {
      const { command } = event.data;

      switch (command) {
        case 'norasoderlund.integrationworkbench.updateHttpRequestPreviewUrl': {
          const [ previewUrlData ]: [ WorkbenchHttpRequestPreviewUrlData ] = event.data.arguments;

          setPreviewUrlData(previewUrlData);
  
          break;
        }
      }
    });

    if(requestData.data.parametersAutoRefresh) {
      window.vscode.postMessage({
        command: "norasoderlund.integrationworkbench.getHttpRequestPreviewUrl",
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
            <VSCodeCheckbox checked={requestData.data.parametersAutoRefresh} onClick={(event) => {
              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.setHttpRequestParameterAutoRefresh",
                arguments: [ (event.target as HTMLInputElement).checked ]
              });
            }}>
              Auto-refresh
            </VSCodeCheckbox>

            <VSCodeButton appearance="icon" aria-label="Delete" onClick={() => {
              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.getHttpRequestPreviewUrl",
                arguments: [ requestData.data.parameters ]
              });
            }}>
              <span className="codicon codicon-refresh"/>
            </VSCodeButton>
          </div>
        </div>

        {(!previewUrlData)?(
          <div>
            <i>No preview available yet.</i>
          </div>
        ):(
          (previewUrlData.success)?(
            <div>{previewUrlData.url}</div>
          ):(
            <div className="infobox infobox-error">
              <div>
                <i className="codicon codicon-error"></i>{" "}<b>An error occured after {Math.round(previewUrlData.duration)}ms:</b>
                
                {(previewUrlData.error) && (
                  <p>
                    {previewUrlData.error}
                  </p>
                )}
              </div>

              <VSCodeButton onClick={(() => 
                window.vscode.postMessage({
                  command: "norasoderlund.integrationworkbench.showOutputLogs",
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

      {(!requestData.data.parameters.length)?(
        <p>This request has no parameters, <VSCodeLink onClick={() => (
          window.vscode.postMessage({
            command: "norasoderlund.integrationworkbench.changeHttpRequestParameters",
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
              command: "norasoderlund.integrationworkbench.changeHttpRequestParameters",
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
              command: "norasoderlund.integrationworkbench.changeHttpRequestParameters",
              arguments: [ requestData.data.parameters ]
            })
          }}
          onDelete={(item) => {
            const index = requestData.data.parameters.indexOf(item);

            requestData.data.parameters.splice(index, 1);

            window.vscode.postMessage({
              command: "norasoderlund.integrationworkbench.changeHttpRequestParameters",
              arguments: [ requestData.data.parameters ]
            });
          }}
        />
      )}
    </div>
  );
};
