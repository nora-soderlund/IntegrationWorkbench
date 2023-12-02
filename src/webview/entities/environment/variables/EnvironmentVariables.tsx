import React, { useEffect, useState } from "react";
import { VSCodeButton, VSCodeCheckbox, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDivider, VSCodeLink } from '@vscode/webview-ui-toolkit/react';
import { WorkbenchHttpRequestPreviewUrlData } from "../../../../interfaces/workbenches/requests/WorkbenchHttpRequestPreviewUrlData";
import KeyValueTable from "../../../components/KeyValueTable";
import { EnvironmentProps } from "../Environment";
import { EnvironmentPreviewVariablesData } from "../../../../interfaces/entities/EnvironmentPreviewVariablesData";

export default function EnvironmentVariables({ environmentData }: EnvironmentProps) {
  const [ previewVariablesData, setPreviewVariablesData ] = useState<EnvironmentPreviewVariablesData | null>(null);

  useEffect(() => {
    window.addEventListener('message', event => {
      const { command } = event.data;

      switch (command) {
        case 'integrationWorkbench.updateEnvironmentPreviewVariables': {
          const [ previewVariablesData ]: [ EnvironmentPreviewVariablesData ] = event.data.arguments;

          setPreviewVariablesData(previewVariablesData);
  
          break;
        }
      }
    });

    if(environmentData.variablesAutoRefresh) {
      window.vscode.postMessage({
        command: "integrationWorkbench.getEnvironmentPreviewVariables",
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
            <VSCodeCheckbox checked={environmentData.variablesAutoRefresh} onClick={(event) => {
              window.vscode.postMessage({
                command: "integrationWorkbench.setEnvironmentVariablesAutoRefresh",
                arguments: [ (event.target as HTMLInputElement).checked ]
              });
            }}>
              Auto-refresh
            </VSCodeCheckbox>

            <VSCodeButton appearance="icon" aria-label="Delete" onClick={() => {
              window.vscode.postMessage({
                command: "integrationWorkbench.getEnvironmentVariablesPreview",
                arguments: [ environmentData.variables ]
              });
            }}>
              <span className="codicon codicon-refresh"/>
            </VSCodeButton>
          </div>
        </div>

        {(!previewVariablesData)?(
          <div>
            <i>No preview available yet...</i>
          </div>
        ):(
          (previewVariablesData.success)?(
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

              {previewVariablesData.items.map(({ key, value }) => (
                <VSCodeDataGridRow key={key} className="data-grid-buttons-hoverable">
                  <VSCodeDataGridCell gridColumn="1">
                    {key}
                  </VSCodeDataGridCell>

                  <VSCodeDataGridCell gridColumn="2">
                    {(value.length)?(
                      value
                    ):(
                      <i>No value...</i>
                    )}
                  </VSCodeDataGridCell>
                </VSCodeDataGridRow>
              ))}
            </VSCodeDataGrid>
          ):(
            <div className="infobox infobox-error">
              <div>
                <i className="codicon codicon-error"></i>{" "}<b>An error occured after {Math.round(previewVariablesData.duration)}ms:</b>
                
                {(previewVariablesData.error) && (
                  <p>
                    {previewVariablesData.error}
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

      {(!environmentData.variables.length)?(
        <p>This request has no parameters, <VSCodeLink onClick={() => (
          window.vscode.postMessage({
            command: "integrationWorkbench.changeEnvironmentVariables",
            arguments: [
              [
                ...environmentData.variables,
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
          items={environmentData.variables}
          onAdd={() => (
            window.vscode.postMessage({
              command: "integrationWorkbench.changeEnvironmentVariables",
              arguments: [
                [
                  ...environmentData.variables,
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
              command: "integrationWorkbench.changeEnvironmentVariables",
              arguments: [ environmentData.variables ]
            })
          }}
          onDelete={(item) => {
            const index = environmentData.variables.indexOf(item);

            environmentData.variables.splice(index, 1);

            window.vscode.postMessage({
              command: "integrationWorkbench.changeEnvironmentVariables",
              arguments: [ environmentData.variables ]
            });
          }}
        />
      )}
    </div>
  );
};
