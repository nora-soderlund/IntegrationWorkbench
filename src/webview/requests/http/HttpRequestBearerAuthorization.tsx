import React, { Component, useEffect, useRef, useState } from "react";
import { HttpRequestProps } from "./HttpRequest";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import HttpRequestBodySwitch from "./HttpRequestBodySwitch";
import { WorkbenchHttpBearerAuthorization, WorkbenchHttpRequestApplicationJsonBodyData, WorkbenchHttpRequestNoneBodyData, WorkbenchHttpRequestRawBodyData } from "../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";

type HttpRequesBearerAuthorizationProps = HttpRequestProps & {
  authorizationData: WorkbenchHttpBearerAuthorization;
};

export default function HttpRequesBearerAuthorization({ requestData, authorizationData }: HttpRequesBearerAuthorizationProps) {
  return (
    <div>
      <VSCodeDataGrid className="data-grid-unfocusable data-grid-unhoverable">
        <VSCodeDataGridRow rowType="header">
          <VSCodeDataGridCell cellType="columnheader" gridColumn="1">
            Token
          </VSCodeDataGridCell>
        </VSCodeDataGridRow>

        <VSCodeDataGridRow>
          <VSCodeDataGridCell gridColumn="1">
            <VSCodeTextField type="text" placeholder="Enter a token..." value={authorizationData.token} onChange={(event) => {
              authorizationData.token = (event.target as HTMLInputElement).value;

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
