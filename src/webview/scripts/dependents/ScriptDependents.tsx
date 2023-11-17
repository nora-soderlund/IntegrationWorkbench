import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeLink, VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";
import { ScriptDependentData } from "../../../interfaces/scripts/ScriptDependentData";
import React, { useEffect, useState } from "react";
import { Dependency } from "../../../interfaces/dependency/Dependency";

export type ScriptDependentProps = {
  scriptDependentsData: ScriptDependentData[];
};

export default function ScriptDependents({ scriptDependentsData }: ScriptDependentProps) {
  return (
    (scriptDependentsData.length === 0)?(
      <p>This script has no dependents.</p>
    ):(
      <React.Fragment>
        <p>This list may contain false-positives. It is only checked if the name of the script exists in the usage.</p>

        <VSCodeDataGrid>
          <VSCodeDataGridRow rowType="header">
            <VSCodeDataGridCell cellType="columnheader" gridColumn="1">
              Request
            </VSCodeDataGridCell>

            <VSCodeDataGridCell cellType="columnheader" gridColumn="2">
              Location
            </VSCodeDataGridCell>

            <VSCodeDataGridCell cellType="columnheader" gridColumn="3">
              Usage
            </VSCodeDataGridCell>
          </VSCodeDataGridRow>

          {scriptDependentsData.map((scriptDependentData, index) => (
            <VSCodeDataGridRow key={index}>
              <VSCodeDataGridCell gridColumn="1">
                <VSCodeLink>{scriptDependentData.request.name}</VSCodeLink>
              </VSCodeDataGridCell>

              <VSCodeDataGridCell gridColumn="2">
                {scriptDependentData.location}
              </VSCodeDataGridCell>

              <VSCodeDataGridCell gridColumn="3">
                <VSCodeTextArea value={scriptDependentData.usage} style={{
                  width: "100%"
                }}/>
              </VSCodeDataGridCell>
            </VSCodeDataGridRow>
          ))}
        </VSCodeDataGrid>
      </React.Fragment>
    )
  );
}