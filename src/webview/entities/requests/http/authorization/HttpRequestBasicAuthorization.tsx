import React, { Component, useEffect, useRef, useState } from "react";
import { HttpRequestProps } from "../HttpRequest";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import HttpRequestBodySwitch from "../body/HttpRequestBodySwitch";
import { WorkbenchHttpBasicAuthorization, WorkbenchHttpRequestApplicationJsonBodyData, WorkbenchHttpRequestNoneBodyData, WorkbenchHttpRequestRawBodyData } from "../../../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import Input from "../../../../components/inputs/Input";
import useDynamicChangeHandler from "../../../../hooks/useDynamicChangeHandler";

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
            <Input maxHeight="8em" type={authorizationData.username.type} value={authorizationData.username.value} onChange={useDynamicChangeHandler((value) => {
              authorizationData.username.value = value;

              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeHttpRequestAuthorization",
                arguments: [ authorizationData ]
              });
            })} onChangeType={(type) => {
              authorizationData.username.type = type;

              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeHttpRequestAuthorization",
                arguments: [ authorizationData ]
              });
            }}/>
          </VSCodeDataGridCell>

          <VSCodeDataGridCell gridColumn="2">
            <Input maxHeight="8em" secret={true} type={authorizationData.password.type} value={authorizationData.password.value} onChange={useDynamicChangeHandler((value) => {
              authorizationData.password.value = value;

              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeHttpRequestAuthorization",
                arguments: [ authorizationData ]
              });
            })} onChangeType={(type) => {
              authorizationData.password.type = type;

              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeHttpRequestAuthorization",
                arguments: [ authorizationData ]
              });
            }}/>
          </VSCodeDataGridCell>
        </VSCodeDataGridRow>
      </VSCodeDataGrid>
    </div>
  );
};
