import { VSCodeCheckbox, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeLink, VSCodeTag, VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";
import { ScriptDependentData } from "../../../interfaces/scripts/ScriptDependentData";
import React, { useEffect, useState } from "react";
import { ScriptDependencyData } from "../../../interfaces/scripts/ScriptDependencyData";

export default function ScriptDependencies() {
  const [ dependencies, setDependencies ] = useState<ScriptDependencyData[]>([]);

  useEffect(() => {
    window.addEventListener('message', event => {
      const { command } = event.data;

      switch (command) {
        case 'integrationWorkbench.updateDependencies': {
          const [ dependencies ] = event.data.arguments;

          setDependencies(dependencies);
  
          break;
        }
      }
    });

    window.vscode.postMessage({
      command: "integrationWorkbench.getDependencies",
      arguments: []
    });
  }, []);

  return (
    <VSCodeDataGrid className="data-grid-unfocusable data-grid-unhoverable">
      <VSCodeDataGridRow rowType="header" className="data-grid-variables-header-row">
        <VSCodeDataGridCell cellType="columnheader" gridColumn="1">
          Dependency
        </VSCodeDataGridCell>

        <VSCodeDataGridCell cellType="columnheader" gridColumn="2"></VSCodeDataGridCell>

        <VSCodeDataGridCell cellType="columnheader" gridColumn="3"></VSCodeDataGridCell>
      </VSCodeDataGridRow>


      {dependencies.map((dependency) => (
        <VSCodeDataGridRow key={dependency.name} className="data-grid-variables-row">
          <VSCodeDataGridCell gridColumn="1" style={{
            display: "flex",
            flexDirection: "row",
            gap: "0.5em",
            alignItems: "center"
          }}>
            {dependency.name}

            <VSCodeTag>{dependency.version}</VSCodeTag>
          </VSCodeDataGridCell>

          <VSCodeDataGridCell gridColumn="2"></VSCodeDataGridCell>

          <VSCodeDataGridCell gridColumn="3">
            <VSCodeCheckbox checked={dependency.used} onChange={() => {
              dependency.used = !dependency.used;

              window.vscode.postMessage({
                command: "integrationWorkbench.updateScriptDependency",
                arguments: [ dependency.name, dependency.used ]
              });

              setDependencies(dependencies);
            }}/>
          </VSCodeDataGridCell>
        </VSCodeDataGridRow>
      ))}
    </VSCodeDataGrid>
  );
}