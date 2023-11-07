import React, { Component, useRef } from "react";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { WorkbenchHttpRequestApplicationJsonBodyData, WorkbenchHttpRequestNoneBodyData, WorkbenchHttpRequestRawBodyData } from "../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import { HttpResponseProps } from "./HttpResponse";

export default function HttpResponseHeaders({ responseData }: HttpResponseProps) {
  if(!responseData.result) {
    return (
      <p>No response result available yet.</p>
    );
  }

  const headers = Object.entries(responseData.result.headers);

  return (
    <div style={{
      width: "100%"
    }}>
      {(!headers.length)?(
        <p>This response has no headers.</p>
      ):(
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

          {headers.map(([ key, value ]) => (
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
      )}
    </div>
  );
};
