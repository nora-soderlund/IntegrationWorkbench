import React, { Component, useRef } from "react";
import { HttpRequestProps } from "../HttpRequest";
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import HttpRequestBodySwitch from "../body/HttpRequestBodySwitch";
import { WorkbenchHttpRequestApplicationJsonBodyData, WorkbenchHttpRequestNoneBodyData, WorkbenchHttpRequestRawBodyData } from "../../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import KeyValueTable from "../../../components/KeyValueTable";

export default function HttpRequestHeaders({ requestData }: HttpRequestProps) {
  return (
    <div>
      {(!requestData.data.headers.length)?(
        <p>This request has no headers, <VSCodeLink onClick={() => (
          window.vscode.postMessage({
            command: "integrationWorkbench.changeHttpRequestHeaders",
            arguments: [
              [
                ...requestData.data.headers,
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
          items={requestData.data.headers}
          onAdd={() => (
            window.vscode.postMessage({
              command: "integrationWorkbench.changeHttpRequestHeaders",
              arguments: [
                [
                  ...requestData.data.headers,
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
              command: "integrationWorkbench.changeHttpRequestHeaders",
              arguments: [ requestData.data.headers ]
            })
          }}
          onDelete={(item) => {
            const index = requestData.data.headers.indexOf(item);

            requestData.data.headers.splice(index, 1);

            window.vscode.postMessage({
              command: "integrationWorkbench.changeHttpRequestHeaders",
              arguments: [ requestData.data.headers ]
            });
          }}
        />
      )}
    </div>
  );
};
