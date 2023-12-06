import React from "react";
import { HttpRequestProps } from "../HttpRequest";
import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from '@vscode/webview-ui-toolkit/react';
import { WorkbenchHttpBearerAuthorization } from "../../../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import Input from "../../../../components/inputs/Input";
import useDynamicChangeHandler from "../../../../hooks/useDynamicChangeHandler";

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
            <Input maxHeight="8em" secret={true} type={authorizationData.token.type} value={authorizationData.token.value} onChange={useDynamicChangeHandler((value) => {
              authorizationData.token.value = value;

              window.vscode.postMessage({
                command: "norasoderlund.integrationworkbench.changeHttpRequestAuthorization",
                arguments: [ authorizationData ]
              });
            })} onChangeType={(type) => {
              authorizationData.token.type = type;

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
