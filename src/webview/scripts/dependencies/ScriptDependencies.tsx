import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeLink, VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";
import { ScriptDependentData } from "../../../interfaces/scripts/ScriptDependentData";
import React, { useEffect, useState } from "react";
import { ScriptDependencyData } from "../../../interfaces/scripts/ScriptDependencyData";
import { Dependency } from "../../../interfaces/dependency/Dependency";

export type ScriptDependenciesProps = {
  scriptDependenciesData: ScriptDependencyData[];
};

export default function ScriptDependencies({ scriptDependenciesData }: ScriptDependenciesProps) {
  const [ dependencies, setDependencies ] = useState<Dependency[]>([]);

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
    <VSCodeDataGrid>
      <VSCodeDataGridRow rowType="header">
        <VSCodeDataGridCell cellType="columnheader" gridColumn="1">
          Dependency
        </VSCodeDataGridCell>

        <VSCodeDataGridCell cellType="columnheader" gridColumn="2"></VSCodeDataGridCell>
      </VSCodeDataGridRow>

      {dependencies.map((dependency) => (
        <VSCodeDataGridRow key={dependency.name}>
          <VSCodeDataGridCell gridColumn="1">
            <VSCodeLink>{dependency.name}</VSCodeLink>
          </VSCodeDataGridCell>

          <VSCodeDataGridCell gridColumn="2">
          </VSCodeDataGridCell>
        </VSCodeDataGridRow>
      ))}
    </VSCodeDataGrid>
  );
}