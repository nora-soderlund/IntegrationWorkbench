import React, { useEffect, useState } from "react";
import { VSCodeButton, VSCodeCheckbox, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDivider, VSCodeLink } from '@vscode/webview-ui-toolkit/react';
import { WorkbenchEventBridgeRequestPreviewArnData } from "../../../../interfaces/workbenches/requests/aws/WorkbenchEventBridgeRequestPreviewArnData";
import KeyValueTable from "../../../components/KeyValueTable";
import { EventBridgeRequestProps } from "./EventBridgeRequest";

export default function EventBridgeRequestParameters({ requestData }: EventBridgeRequestProps) {
  const [ previewArnData, setPreviewArnData ] = useState<WorkbenchEventBridgeRequestPreviewArnData | null>(null);

  useEffect(() => {
    window.addEventListener('message', event => {
      const { command } = event.data;

      switch (command) {
        case 'norasoderlund.integrationworkbench.updateEventBridgePreviewArn': {
          const [ previewArnData ]: [ WorkbenchEventBridgeRequestPreviewArnData ] = event.data.arguments;

          setPreviewArnData(previewArnData);
  
          break;
        }
      }
    });

    if(requestData.data.parametersAutoRefresh) {
      window.vscode.postMessage({
        command: "norasoderlund.integrationworkbench.getEventBridgePreviewArn",
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
                command: "norasoderlund.integrationworkbench.getEventBridgePreviewArn",
                arguments: [ requestData.data.parameters ]
              });
            }}>
              <span className="codicon codicon-refresh"/>
            </VSCodeButton>
          </div>
        </div>

        {(!previewArnData)?(
          <div>
            <i>No preview available yet.</i>
          </div>
        ):(
          (previewArnData.success)?(
            <div>{previewArnData.eventBridgeArn}</div>
          ):(
            <div className="infobox infobox-error">
              <div>
                <i className="codicon codicon-error"></i>{" "}<b>An error occured after {Math.round(previewArnData.duration)}ms:</b>
                
                {(previewArnData.error) && (
                  <p>
                    {previewArnData.error}
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
          onChange={() => 
            window.vscode.postMessage({
              command: "norasoderlund.integrationworkbench.changeHttpRequestParameters",
              arguments: [ requestData.data.parameters ]
            })
          }
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
