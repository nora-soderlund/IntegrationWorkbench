import React, { Component, useEffect, useRef, useState } from "react";
import { HttpRequestProps } from "../HttpRequest";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import HttpRequestBodySwitch from "../body/HttpRequestBodySwitch";
import { WorkbenchHttpBasicAuthorization, WorkbenchHttpRequestApplicationJsonBodyData, WorkbenchHttpRequestNoneBodyData, WorkbenchHttpRequestRawBodyData } from "../../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";

type HttpRequesBasicAuthorizationProps = HttpRequestProps & {
  authorizationData: WorkbenchHttpBasicAuthorization;
};

export default function HttpRequesBasicAuthorization({ requestData, authorizationData }: HttpRequesBasicAuthorizationProps) {
  return (
    <div>
      <VSCodeDataGrid className="data-grid-unfocusable data-grid-unhoverable">
        <VSCodeDataGridRow rowType="header">
          <VSCodeDataGridCell cellType="columnheader" gridColumn="1">
            Username
          </VSCodeDataGridCell>

          <VSCodeDataGridCell cellType="columnheader" gridColumn="2">
            Password
          </VSCodeDataGridCell>
        </VSCodeDataGridRow>

        <VSCodeDataGridRow>
          <VSCodeDataGridCell gridColumn="1">
            <VSCodeTextField type="text" placeholder="Enter an username..." value={authorizationData.username} onChange={(event) => {
              authorizationData.username = (event.target as HTMLInputElement).value;

              window.vscode.postMessage({
                command: "integrationWorkbench.changeHttpRequestAuthorization",
                arguments: [ authorizationData ]
              });
            }}/>
          </VSCodeDataGridCell>

          <VSCodeDataGridCell gridColumn="2">
            <VSCodeTextField type="password" placeholder="Enter a password..." value={authorizationData.password} onChange={(event) => {
              authorizationData.password = (event.target as HTMLInputElement).value;

              window.vscode.postMessage({
                command: "integrationWorkbench.changeHttpRequestAuthorization",
                arguments: [ authorizationData ]
              });
            }}/>
          </VSCodeDataGridCell>
        </VSCodeDataGridRow>
      </VSCodeDataGrid>
    </div>
  );
};
